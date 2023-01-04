/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-29 21:38:40
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-01 19:52:30
 */

import { SuccessMessage } from '@core/Common/interfaces/common.interface';
import { ResponseMessage } from '@decorators/response.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateScreenDto, UpdateScreenDto } from './screen.dto';
import ScreenService from './screen.service';

@ApiTags('System Screen')
@Controller('screen')
export default class ScreenController {
  constructor(private readonly screenService: ScreenService) {}

  @ResponseMessage(SuccessMessage.CREATE, 'screen')
  @Post()
  async createScreen(@Body() data: CreateScreenDto) {
    return await this.screenService.createScreen(data);
  }

  @ResponseMessage(SuccessMessage.FETCH, 'screen')
  @Get()
  async getAllScreen() {
    return await this.screenService.getAllScreen();
  }

  @ResponseMessage(SuccessMessage.UPDATE, 'screen')
  @Patch(':screenId')
  async updateScreen(
    @Param('screenId') screenId: number,
    @Body() data: UpdateScreenDto,
  ) {
    return await this.screenService.updateScreen(screenId, data);
  }

  @ResponseMessage(SuccessMessage.DELETE, 'screen')
  @Delete('screenId')
  async deleteScreen(@Param('screenId') screenId: number) {
    return this.screenService.deleteScreen(screenId);
  }

  // @ResponseMessage(SuccessMessage.ARCHIVE, 'screen')
  // @Delete('archive/:screenId')
  // async archiveScreen(@Param('screenId') screenId: number) {
  //   return this.screenService.archiveScreen(screenId);
  // }
}
