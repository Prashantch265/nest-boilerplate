import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CookieService {
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isProduction =
      this.configService.get<string>('app.env') === 'production';
  }

  /**
   * Sets the access and refresh tokens in secure, HttpOnly cookies.
   * @param res - The Express response object.
   * @param accessToken - The JWT access token.
   * @param refreshToken - The JWT refresh token.
   */
  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string | null,
  ): void {
    // Set Access Token Cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Prevents client-side JS access
      secure: this.isProduction, // Only send over HTTPS in production
      sameSite: this.isProduction ? 'none' : 'lax', // Mitigates CSRF attacks
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set Refresh Token Cookie if provided
    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: this.isProduction,
        sameSite: this.isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
  }

  /**
   * Clears the authentication cookies on logout.
   * @param res - The Express response object.
   */
  clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken', {
      httpOnly: true, // Prevents client-side JS access
      secure: this.isProduction, // Only send over HTTPS in production
      sameSite: this.isProduction ? 'none' : 'lax', // Mitigates CSRF attacks
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
