import { SuccessMessage } from '@core/Common/interfaces/common.interface';
import { ResponseMessage } from '@decorators/response.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUsersDto } from './users.dto';
import UserService from './users.service';

@ApiTags('Internal Users')
@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @ResponseMessage(SuccessMessage.CREATE, 'internal users')
  @Post()
  async createUser(@Body() data: CreateUsersDto) {
    return await this.userService.create(data);
  }

  @ResponseMessage(SuccessMessage.FETCH, 'internal users')
  @Get()
  async getAllUser() {
    return await this.userService.getAll();
  }
}
