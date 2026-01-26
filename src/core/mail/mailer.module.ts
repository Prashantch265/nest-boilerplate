import { Global, Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mailer.service';

@Global() // Make the MailerService available application-wide
@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('mailer.host'),
          port: config.get<number>('mailer.port'),
          secure: config.get<boolean>('mailer.secure'),
          auth: {
            user: config.get<string>('mailer.user'),
            pass: config.get<string>('mailer.pass'),
          },
        },
        defaults: {
          from: config.get<string>('mailer.from'),
        },
        template: {
          dir: join(process.cwd(), 'views/email'), // Path to your email templates
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService], // Export the service to be used in other modules
})
export class MailModule {}
