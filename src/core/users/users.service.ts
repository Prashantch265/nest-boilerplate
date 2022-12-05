import { InjectRepository } from '@mikro-orm/nestjs';
import { Repository } from 'typeorm';
import User from './users.entity';

export default class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOneByField(where = {}, relations = []) {
    where = { ...where, isDeleted: false, isActive: true };
    return this.userRepository.findOne({ where, relations });
  }
}
