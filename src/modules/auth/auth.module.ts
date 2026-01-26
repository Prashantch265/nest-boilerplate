import { Module } from '@nestjs/common';
import { CookieModule } from '../../core/cookies/cookie.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from '../../core/strategies/google.strategy';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { OtpModule } from '../otp/otp.module';
import { UserModule } from '../users/users.module';
import { StudentModule } from '../users/students/students.module';
import { CustomJwtModule } from '../../core/jwt/jwt.module';
import { MailModule } from '../../core/mail/mailer.module';
import { ContextModule } from '../../core/context/context.module';
import { AdminModule } from '../users/admin/admin.module';

@Module({
  imports: [
    ConfigModule,
    ContextModule,
    CookieModule,
    CustomJwtModule,
    MailModule,
    OtpModule,
    UserModule,
    StudentModule,
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  exports: [],
})
export class AuthModule {}
