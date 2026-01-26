import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CookieService } from '../../core/cookies/cookie.service';
import { GoogleOAuthGuard } from '../../core/guards/google-oauth.guard';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { EmailSignupDto } from './dtos/email-password-signup.dto';
import { Public } from '../../core/decorators/public-route.decorator';
import { SuccessMessage } from '../../core/decorators/success-message.decorator';
import { EmailSigninDto } from './dtos/email-password-signin.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private frontendUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService,
  ) {
    this.frontendUrl = this.configService.get<string>(
      'frontend.url',
      'http://localhost:3000',
    );
  }

  @Get('me') // <-- NEW ENDPOINT
  @ApiOperation({
    summary: "Get the current user's session details (profile & permissions)",
    description:
      'Protected endpoint to get all necessary user data (profile, permissions) after login to hydrate the frontend.',
  })
  @SuccessMessage('Session details retrieved successfully.')
  getUserSession() {
    // This endpoint is protected by the global JwtAuthGuard.
    // The guard populates the ContextService.
    // The authService.getUserSessionDetails() method reads from that context.
    return this.authService.getUserSessionDetails();
  }

  @Public()
  @Post('signin')
  @ApiOperation({
    summary: 'Signin with Email',
    description: 'Signin users using email and password',
  })
  @HttpCode(HttpStatus.OK)
  @SuccessMessage('Signin successful.')
  async emailSignin(
    @Body() signinDto: EmailSigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokens, user } =
      await this.authService.signInWithEmailAndPassword(signinDto);

    this.cookieService.setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
    );

    return { userType: user.userType };
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK) // Use 200 OK for logout
  @ApiOperation({ summary: 'Logout User' })
  @SuccessMessage('Logout successful.')
  logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.clearAuthCookies(res);
    // No need to return anything, cookie clearing is the action
    return;
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Google Signin' })
  async googleAuth() {}

  @Public()
  @Post('verify-email')
  @ApiOperation({
    summary: 'Verify Email with OTP',
    description: 'Verify user email by using OTP recieved in their email',
  })
  @SuccessMessage('Email verified successfully. You can now sign in.')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.authService.verifyEmailOtp(verifyOtpDto);
    // No data needs to be returned, the success interceptor handles the response
  }

  @Public()
  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend Verification OTP' })
  @SuccessMessage(
    'If an account with that email exists, a new OTP has been sent.',
  )
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    await this.authService.resendVerificationOtp(resendOtpDto);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @SuccessMessage(
    'If an account with that email exists, a password reset link has been sent.',
  )
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @SuccessMessage(
    'Your password has been reset successfully. You can now sign in.',
  )
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Post('signup/student')
  @ApiOperation({
    summary: 'Signup with Email',
    description: 'Student signup using email and password',
  })
  @SuccessMessage(
    'Signup successful. Please check your email to verify your account.',
  )
  async emailSignup(@Body() signUpDto: EmailSignupDto) {
    const user = await this.authService.signUpWithEmailAndPassword(signUpDto);

    // For security, never return the password in the response
    delete user.password;

    return user;
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { tokens } = await this.authService.signInWithGoogle(req.user);

    this.cookieService.setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
    );

    // TODO: Redirect to the frontend application
    res.redirect(this.frontendUrl + '/dashboard');
  }
}
