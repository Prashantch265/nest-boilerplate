import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAuthenticateOptions(context: ExecutionContext) {
    return {
      accessType: 'offline',
      prompt: 'consent',
    };
  }
}
