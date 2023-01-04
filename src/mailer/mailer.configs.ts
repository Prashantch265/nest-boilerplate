import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import readConfigurations from 'src/config/read-configs';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mailerConfigs = (): MailerOptions => {
  const config = readConfigurations();
  const configService: ConfigService = new ConfigService<
    Record<string, unknown>,
    false
  >(config);
  const mailerConfig = configService.get('mailer');
  return {
    transport: {
      host: mailerConfig.host,
      port: mailerConfig.port,
      ignoreTLS: true,
      secure: true,
      auth: {
        user: mailerConfig.auth.user,
        pass: mailerConfig.auth.pass,
      },
    },
    defaults: {
      from: `No Reply <${mailerConfig.domainName}>`,
    },
    preview: true,
    template: {
      dir: process.cwd() + '/template/',
      adapter: new HandlebarsAdapter(undefined, { inlineCssEnabled: true }), // or new PugAdapter() or new EjsAdapter()
      options: {
        strict: true,
      },
    },
    options: {
      partials: {
        dir: process.cwd() + '/template/partials',
        options: {
          strict: true,
        },
      },
    },
  };
};
