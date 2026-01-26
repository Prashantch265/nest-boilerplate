import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { UserService } from '../../modules/users/users.service';
import { TokenPayload } from '../jwt/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (req: Request) => req.cookies?.accessToken ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessTokenSecret') ?? '',
      passReqToCallback: true,
    };
    super(options);
  }
  /**
   * This method is called by Passport after it has successfully validated the JWT.
   * It attaches the user object to the request.
   */
  async validate(req: Request, payload: TokenPayload) {
    // Passport ensures the token is valid, now we ensure the user exists.
    const user = await this.usersService.getUserByUserId(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user; // Attaches the full user object to req.user
  }
}
