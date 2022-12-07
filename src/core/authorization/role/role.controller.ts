import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { QueryStringsRole, TypesRole } from './role.interface';
import RoleService from './role.service';

@ApiTags('role')
@Controller('role')
export default class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ResponseMessage('create', 'role')
  @Post('/')
  async create(@Body() data: TypesRole) {
    return await this.roleService.add(data);
  }

  @ResponseMessage('fetch', 'role')
  @Get('/')
  async getAll(@Query() queryStrings: QueryStringsRole) {
    return await this.getAll(queryStrings);
  }
}
