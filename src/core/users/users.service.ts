import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RuntimeException } from 'src/exceptions/runtime.exception';
import { Repository } from 'typeorm';
import User from './users.entity';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByField(where = {}, relations = []) {
    where = { ...where, isDeleted: false, isActive: true };
    return this.userRepository.findOne({ where, relations });
  }
}
