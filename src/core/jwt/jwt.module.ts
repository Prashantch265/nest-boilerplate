import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CustomJwtService } from './jwt.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessTokenSecret', 'mysecret'),
        signOptions: {
          expiresIn: configService.get<string>(
            'jwt.accessTokenExpiresIn',
            '1h',
          ),
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  providers: [CustomJwtService],
  exports: [CustomJwtService],
})
export class CustomJwtModule {}
