import { Controller } from '@nestjs/common';
import ExternalUserService from './external-users.service';

@Controller('external-users')
export default class ExternalUserController {
  constructor(private readonly externalUserService: ExternalUserService) {}
}
