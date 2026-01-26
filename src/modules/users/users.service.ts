import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OAUTH_PROVIDERS,
  SIGNUP_METHOD,
  USER_STATUS,
  USER_TYPE,
} from '../../common/enums/users.enum';
import { NotFoundException } from '../../core/exceptions';
import { hashPassword } from '../../core/utils/helpers/password.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user record for an email/password signup.
   * Hashes the password before saving using the password helper.
   */
  async createUserWithEmailAndPassword(userData: {
    email: string;
    password: string;
    userType: USER_TYPE;
  }): Promise<User> {
    const hashedPassword = await hashPassword(userData.password);

    const userStatus =
      userData.userType !== USER_TYPE.ADMIN
        ? USER_STATUS.PENDING
        : USER_STATUS.ACTIVE;

    const newUser = this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      status: userStatus, // Email verification is required
      signUpMethod: SIGNUP_METHOD.EMAIL,
      userType: userData.userType,
    });

    return this.userRepository.save(newUser);
  }

  /**
   * Creates a new user record for a Google OAuth signup.
   */
  async createUserWithGoogleOauth(googleUser: {
    email: string;
    oAuthId: string;
  }): Promise<User> {
    const newUser = this.userRepository.create({
      email: googleUser.email,
      oAuthId: googleUser.oAuthId,
      oAuthProvider: OAUTH_PROVIDERS.GOOGLE,
      status: USER_STATUS.ACTIVE, // Automatically activate OAuth users
      signUpMethod: SIGNUP_METHOD.OAUTH,
      userType: USER_TYPE.STUDENT,
    });

    return this.userRepository.save(newUser);
  }

  /**
   * Finds a single user by their unique userId.
   * Throws a NotFoundException if the user is not found.
   */
  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      select: ['userId', 'userType', 'status', 'email', 'lastLoginAt', 'roles'],
      where: { userId, status: USER_STATUS.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  /**
   * Finds a single user based on a flexible set of conditions.
   * Returns the user object or null if not found.
   */
  async getUserWithWhereCondition(
    whereCondition: Partial<User>,
  ): Promise<User | null> {
    return this.userRepository.findOne({ where: whereCondition });
  }

  /**
   * Finds multiple users by their IDs, including their roles.
   * Optimized to select only necessary fields for role mapping.
   */
  async findUsersWithRolesByIds(userIds: string[]): Promise<User[]> {
    if (!userIds || userIds.length === 0) {
      return [];
    }
    return this.userRepository.find({
      where: { userId: In(userIds) },
      relations: ['roles'], // Ensure roles are loaded
      select: ['userId', 'roles'], // Select only necessary fields
    });
  }

  /**
   * Updates the status of a user's account.
   */
  async updateUserStatus(userId: string, status: USER_STATUS): Promise<void> {
    await this.userRepository.update(userId, { status });
  }

  /**
   * Updates a user's password after hashing it.
   */
  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await hashPassword(newPassword);
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  /**
   * Update the lastLoginAt field to the current time
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLoginAt: new Date() });
  }

  /**
   * Saves a user entity to the database.
   * This is useful for complex updates, such as modifying relationships (e.g., roles).
   */
  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
