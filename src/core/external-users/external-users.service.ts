import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import ExternalUser from './external-users.entity';
import { externalUser } from './external-users.interface';

@Injectable()
export default class ExternalUserService {
  constructor(
    @InjectRepository(ExternalUser)
    private readonly externalUserRepository: Repository<ExternalUser>,
  ) {}

  async findOneByField(where = {}, relations = []) {
    where = { ...where, isDeleted: false, isActive: true };
    return this.externalUserRepository.findOne({ where, relations });
  }

  async saveUserFromOauth(user) {
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
}
