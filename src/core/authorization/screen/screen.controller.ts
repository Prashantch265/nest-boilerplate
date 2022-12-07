import { Controller } from '@nestjs/common';
import ScreenService from './screen.service';

@Controller('screen')
export default class ScreenController {
  constructor(private readonly screenService: ScreenService) {}
}
