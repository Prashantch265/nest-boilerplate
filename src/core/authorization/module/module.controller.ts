import { Controller } from '@nestjs/common';
import ModulesService from './module.service';

@Controller('module')
export default class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}
}
