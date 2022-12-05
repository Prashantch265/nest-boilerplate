import { InjectRepository } from '@mikro-orm/nestjs';
import { Repository } from 'typeorm';
import ExternalUser from './external-users.entity';

export default class ExternalUserService {
  constructor(
    @InjectRepository(ExternalUser)
    private readonly externalUserRepository: Repository<ExternalUser>,
  ) {}

  async findOneByField(where = {}, relations = []) {
    where = { ...where, isDeleted: false, isActive: true };
    return this.externalUserRepository.findOne({ where, relations });
  }
}
