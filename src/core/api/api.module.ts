import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiService } from './api.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
