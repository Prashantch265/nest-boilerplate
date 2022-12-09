import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/auth.interface';
import { RuntimeException } from 'src/exceptions/runtime.exception';
import { Repository } from 'typeorm';
import { RecievedOtpDto } from '../otp/otp.interface';
import ExternalUser from './external-users.entity';
import { externalUserDto } from './external-users.interface';

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

  async saveUserFromSignUp(user: RegisterUserDto) {
    return await this.externalUserRepository.save(user);
  }

  async saveUserFromOauth(user: any) {
    const userData: externalUserDto = {
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

  async update(user: externalUserDto | any, where = {}) {
    const existingUser = await this.findOneByField({ where });
    if (!existingUser) throw new RuntimeException(400, 'notFound', 'user');
    const updatedUser = { ...existingUser, ...user };
    return await this.externalUserRepository.save(updatedUser);
  }
}
