import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import PrivilegeService from './privilege.service';

@ApiTags('privilege')
@Controller('privilege')
export default class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}
}
