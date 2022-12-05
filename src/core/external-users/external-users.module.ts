import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ExternalUserController from './external-users.controller';
import ExternalUser from './external-users.entity';
import ExternalUserService from './external-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExternalUser])],
  controllers: [ExternalUserController],
  providers: [ExternalUserService],
  exports: [ExternalUserService],
})
export default class ExternalUsersModule {}
