import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const rootPath = path.join(
          process.cwd(),
          configService
            .get<string>('storage.filesystem.baseDir', 'uploads')
            ?.trim(),
        );

        return [
          {
            rootPath: rootPath,
            serveRoot: '/static',
            serveStaticOptions: {
              maxAge: '1d',
            },
          },
        ];
      },
      inject: [ConfigService],
    }),
  ],
})
export class CustomServeStaticModule {}
