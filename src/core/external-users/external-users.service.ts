import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RegisterUser } from 'src/auth/auth.interface';
import { RuntimeException } from 'src/exceptions/runtime.exception';
import { Repository } from 'typeorm';
import { RecievedOtp } from '../otp/otp.interface';
import ExternalUser from './external-users.entity';
import { externalUser } from './external-users.interface';

@Injectable()
export default class ExternalUserService {
  constructor(
    @InjectRepository(ExternalUser)
    private readonly externalUserRepository: Repository<ExternalUser>,
  ) {}

  async findOneByField(where = {}, select = [], relations = []) {
    where = { ...where, isDeleted: false, isActive: true };
    return this.externalUserRepository.findOne({ select, where, relations });
  }

  async saveUserFromSignUp(user: RegisterUser) {
    return await this.externalUserRepository.save(user);
  }

  async saveUserFromOauth(user: any) {
    const userData: externalUser = {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      sub: user.sub,
      provider: user.provider,
      email: user.email,
      profilePic: user.picture,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };
    return await this.externalUserRepository.save(userData);
  }

  async update(user: externalUser | any, where = {}) {
    const existingUser = await this.findOneByField({ where });
    if (!existingUser) throw new RuntimeException(400, 'notFound', 'user');
    const updatedUser = { ...existingUser, ...user };
    return await this.externalUserRepository.save(updatedUser);
  }
}
