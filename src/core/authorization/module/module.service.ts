import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import ModulesEntity from './module.entity';

@Injectable()
export default class ModulesService {
  constructor(
    @InjectRepository(ModulesEntity)
    private readonly modulesRepository: Repository<ModulesEntity>,
  ) {}
}
