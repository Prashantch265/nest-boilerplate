import { Controller } from '@nestjs/common';
import UserService from './users.service';

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}
}
