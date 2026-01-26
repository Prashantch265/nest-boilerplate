import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomJwtService } from '../../core/jwt/jwt.service';
import { StudentService } from '../users/students/students.service';
import { User } from '../users/users.entity';
import { UserService } from '../users/users.service';
import { GoogleUserDto } from './dtos/google-signin.dto';
import { EmailSignupDto } from './dtos/email-password-signup.dto';
import { USER_STATUS, USER_TYPE } from '../../common/enums/users.enum';
import { EmailSigninDto } from './dtos/email-password-signin.dto';
import { comparePassword } from '../../core/utils/helpers/password.helper';
import { OtpService } from '../otp/otp.service';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { ContextService } from '../../core/context/context.service';
import { AdminService } from '../users/admin/admin.service';
import { Admin } from '../users/admin/entities/admin.entity';
import { Student } from '../users/students/entities/students.entity';

type SessionProfile = Partial<Admin> | Partial<Student> | null;

interface SessionUser extends Omit<User, 'roles'> {
  profile: SessionProfile;
  permissions: string[];
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private frontendUrl: string;

  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly jwtService: CustomJwtService,
    private readonly otpService: OtpService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly contextService: ContextService,
    private readonly adminService: AdminService,
  ) {
    this.frontendUrl = this.configService.get<string>(
      'frontend.url',
      'http://localhost:3000',
    );
  }

  /**
   * Retrieves the full profile and permissions for the currently authenticated user.
   * This is the main endpoint for hydrating the frontend after login.
   */
  async getUserSessionDetails(): Promise<{ user: any }> {
    const currentUser = this.contextService.currentUser;
    if (!currentUser) {
      throw new UnauthorizedException('No user found in session.');
    }

    // 1. Get the full user object, including roles and permissions
    // The `roles` relation is eagerly loaded on the User entity.
    const userWithRoles = await this.userService.getUserByUserId(
      currentUser.userId,
    );

    // 2. Get the specific profile (Student or Admin)
    let profile: SessionProfile;

    switch (userWithRoles.userType) {
      case USER_TYPE.ADMIN:
        profile = await this.adminService.getAdminByUserId(
          userWithRoles.userId,
        );
        break;

      case USER_TYPE.STUDENT:
        profile = await this.studentService.getStudentByUserId(
          userWithRoles.userId,
        );
        break;

      default:
        this.logger.error(`Unknown user type: ${userWithRoles.userType}`);
        throw new InternalServerErrorException('Unknown user type');
    }

    // 3. Flatten all permissions into a simple string array for the frontend
    const permissions =
      userWithRoles.roles?.flatMap((role) =>
        role.permissions.map((p) => p.code),
      ) ?? [];

    // Use Set to remove duplicate permission codes
    const uniquePermissions = [...new Set(permissions)];

    // Construct session user with strong typing
    const sessionUser: SessionUser = {
      ...userWithRoles,
      profile,
      permissions: uniquePermissions,
    };

    // Remove roles to avoid leaking sensitive data
    delete (sessionUser as any).roles;

    return {
      user: sessionUser,
    };
  }

  /**
   * Handles signin with email and password.
   * 1. Finds the user by email.
   * 2. Verifies the password.
   * 3. Checks if the user's account is active.
   * 4. Generates and returns JWTs.
   */
  async signInWithEmailAndPassword(signinDto: EmailSigninDto): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // Step 1: Find user by email
    const user = await this.userService.getUserWithWhereCondition({
      email: signinDto.email,
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Step 2: Verify the password
    const isPasswordMatch = await comparePassword(
      signinDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Step 3: Check if the user's account is active
    if (user.status !== USER_STATUS.ACTIVE) {
      throw new UnauthorizedException(
        'Account is not active. Please verify your email.',
      );
    }

    // --- Update Last Login Time ---
    await this.userService.updateLastLogin(user.userId);

    // Step 4: Generate JWTs for the user session
    const payload = { sub: user.userId, userType: user.userType };
    const accessToken = await this.jwtService.signAccessToken(payload);
    const refreshToken = await this.jwtService.signRefreshToken(payload);

    return { user, tokens: { accessToken, refreshToken } };
  }

  /**
   * Handles student signup with email and password.
   * 1. Validates input (passwords match).
   * 2. Checks for an existing user with the same email.
   * 3. Creates a new User with PENDING status.
   * 4. Creates a corresponding Student profile.
   * 5. Returns the new user (the next step would be email verification).
   */
  async signUpWithEmailAndPassword(signUpDto: EmailSignupDto): Promise<User> {
    // Step 1: Validate passwords match
    if (signUpDto.password !== signUpDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Step 2: Check if a user with this email already exists
    const existingUser = await this.userService.getUserWithWhereCondition({
      email: signUpDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Step 3: Create the core user record
    const newUser = await this.userService.createUserWithEmailAndPassword({
      email: signUpDto.email,
      password: signUpDto.password,
      userType: USER_TYPE.STUDENT,
    });

    // Step 4: Create the associated student profile
    await this.studentService.createStudent({
      user: newUser,
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
    });

    // Generate and send OTP
    const otpCode = await this.otpService.createOtp(newUser);
    await this.mailerService.sendMail({
      to: newUser.email,
      subject: 'Verify Your Email Address',
      template: 'verify-email', // Corresponds to otp.ejs
      context: {
        name: `${signUpDto.firstName} ${signUpDto.lastName}`,
        otp: otpCode,
      },
    });

    return newUser;
  }

  /**
   * Verifies the OTP and activates the user account.
   */
  async verifyEmailOtp(verifyOtpDto: VerifyOtpDto): Promise<void> {
    const user = await this.userService.getUserWithWhereCondition({
      email: verifyOtpDto.email,
    });

    if (!user) {
      throw new BadRequestException('Invalid verification request');
    }
    if (user.status === USER_STATUS.ACTIVE) {
      throw new BadRequestException('Email is already verified');
    }

    const validOtp = await this.otpService.findValidOtp(
      user.userId,
      verifyOtpDto.otpCode,
    );

    if (!validOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.userService.updateUserStatus(user.userId, USER_STATUS.ACTIVE);
    await this.otpService.markOtpAsVerified(validOtp.id);
  }

  /**
   * Handles the logic for Google OAuth sign-in for students.
   * 1. Checks if a user with the Google email already exists.
   * 2. If not, it creates a new User and a corresponding Student profile.
   * 3. If the user exists, it proceeds to generate tokens.
   * 4. Generates and returns JWT access and refresh tokens for the session.
   */
  async signInWithGoogle(googleUser: GoogleUserDto): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    if (!googleUser || !googleUser.email) {
      throw new InternalServerErrorException(
        'Google user data is missing or invalid',
      );
    }

    // Step 1: Check if the user already exists in our database
    let user = await this.userService.getUserWithWhereCondition({
      email: googleUser.email,
    });

    // Step 2: If the user is new, create both the core user and the student profile
    if (!user) {
      const newUser = await this.userService.createUserWithGoogleOauth({
        email: googleUser.email,
        oAuthId: googleUser.sub,
      });

      await this.studentService.createStudent({
        user: newUser,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
      });

      // Use the newly created user for token generation
      user = newUser;
    }

    // --- Update Last Login Time ---
    await this.userService.updateLastLogin(user.userId);

    // Step 3: Generate JWTs for the user session
    const payload = { sub: user.userId, userType: user.userType };
    const accessToken = await this.jwtService.signAccessToken(payload);
    const refreshToken = await this.jwtService.signRefreshToken(payload);

    return { user, tokens: { accessToken, refreshToken } };
  }

  /**
   * Resends a verification OTP to a user's email.
   */
  async resendVerificationOtp(resendOtpDto: ResendOtpDto): Promise<void> {
    const user = await this.userService.getUserWithWhereCondition({
      email: resendOtpDto.email,
    });

    if (!user || user.status !== USER_STATUS.PENDING) {
      throw new NotFoundException('User with this email not found');
    }

    const otpCode = await this.otpService.createOtp(user);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Your New Verification Code',
      template: 'verify-email',
      context: {
        name: user.email,
        otp: otpCode,
      },
    });
  }

  /**
   * Initiates the password reset process.
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.getUserWithWhereCondition({
      email: forgotPasswordDto.email,
    });

    if (user) {
      const payload = { sub: user.userId, userType: user.userType };
      const resetToken = await this.jwtService.signPasswordResetToken(payload);
      const resetLink = `${this.frontendUrl}/reset-password?token=${resetToken}`;

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Reset Your Koreaconnex Password',
        template: 'password-reset',
        context: {
          name: user.email,
          resetLink,
        },
      });
    }
  }

  /**
   * Resets a user's password using a valid token.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    try {
      const decoded = await this.jwtService.verifyPasswordResetToken(
        resetPasswordDto.token,
      );
      await this.userService.updateUserPassword(
        decoded.sub,
        resetPasswordDto.newPassword,
      );
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(
        'Invalid or expired password reset token',
      );
    }
  }
}
