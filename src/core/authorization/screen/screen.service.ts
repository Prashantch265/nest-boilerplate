/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-31 16:40:03
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:49:09
 */

import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { FindOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateScreenDto, UpdateScreenDto } from './screen.dto';
import Screen from './screen.entity';

@Injectable()
export default class ScreenService {
  constructor(
    @InjectRepository(Screen)
    private readonly screenRepository: EntityRepository<Screen>,
  ) {}

  async findOneByFeild(where = {}, options: FindOptions<Screen> = {}) {
    where = { ...where, isActive: true };
    return await this.screenRepository.findOne(where, options);
  }

  async createScreen(data: CreateScreenDto) {
    const screen: Screen = this.screenRepository.create({ ...Screen, ...data });
    await this.screenRepository.persistAndFlush(screen);
    return screen;
  }

  async getAllScreen() {
    return await this.screenRepository.findAll({
      fields: ['id', 'name', 'code', 'description'],
      filters: { isActive: true },
    });
  }

  async getScreenById(screenId: number) {
    const screen = await this.findOneByFeild(
      { id: screenId },
      { fields: ['id', 'name', 'code', 'description'] },
    );

    if (!screen)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'screen',
      );

    return screen;
  }

  async getScreenByCode(code: string) {
    const screen = await this.findOneByFeild(
      { code: code },
      { fields: ['id', 'name', 'code', 'description'] },
    );

    if (!screen)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'screen',
      );

    return screen;
  }

  async updateScreen(screenId: number, data: UpdateScreenDto) {
    const existingScreen = await this.findOneByFeild({ id: screenId });
    if (!existingScreen)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'screen',
      );
    const updatedScreen: Screen = this.screenRepository.assign(
      existingScreen,
      data,
    );
    await this.screenRepository.persistAndFlush(updatedScreen);
    return screenId;
  }

  async deleteScreen(screenId: number) {
    return await this.screenRepository.nativeDelete({ id: screenId });
  }

  // async archiveScreen(screenId: number) {
  //   const existingScreen = await this.findOneByFeild({ id: screenId });
  //   if (!existingScreen)
  //     throw new RuntimeException(
  //       HttpStatus.NOT_FOUND,
  //       ErrorMessage.NOT_FOUND,
  //       'screen',
  //     );
  //   const updatedScreen = this.screenRepository.create({
  //     ...existingScreen,
  //     ...{ isActive: false },
  //   });
  //   await this.screenRepository.persistAndFlush(updatedScreen);
  //   return screenId;
  // }
}
