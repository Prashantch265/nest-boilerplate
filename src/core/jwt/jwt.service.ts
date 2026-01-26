import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DecodedToken, TokenPayload } from './jwt.interface';

@Injectable()
export class CustomJwtService {
  private readonly logger = new Logger(CustomJwtService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Signs an access token for a user.
   * Uses the default secret and expiration from the JwtModule registration.
   */
  async signAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /**
   * Signs a refresh token for a user.
   * Overrides the default options with refresh token specific secret and expiration.
   */
  async signRefreshToken(payload: TokenPayload): Promise<string> {
    const secret = this.configService.get<string>('jwt.refreshTokenSecret');
    const expiresIn = this.configService.get<string>(
      'jwt.refreshTokenExpiresIn',
    );

    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  /**
   * Verifies a refresh token.
   */
  async verifyRefreshToken(token: string): Promise<DecodedToken> {
    const secret = this.configService.get<string>('jwt.refreshTokenSecret');
    try {
      return await this.jwtService.verifyAsync<DecodedToken>(token, {
        secret,
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Signs a password reset token.
   */
  async signPasswordResetToken(payload: TokenPayload): Promise<string> {
    const secret = this.configService.get<string>('jwt.passwordResetSecret');
    const expiresIn = this.configService.get<string>(
      'jwt.passwordResetExpiresIn',
    );

    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  /**
   * Verifies a password reset token.
   */
  async verifyPasswordResetToken(token: string): Promise<DecodedToken> {
    const secret = this.configService.get<string>('jwt.passwordResetSecret');
    try {
      return await this.jwtService.verifyAsync<DecodedToken>(token, {
        secret,
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(
        'Invalid or expired password reset token',
      );
    }
  }
}
