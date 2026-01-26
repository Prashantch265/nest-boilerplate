import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { ApiService } from '../api/api.service';

@Injectable()
export class ApiKeyValidationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ApiKeyValidationMiddleware.name);

  constructor(
    private readonly apiService: ApiService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      this.logger.warn('API key validation failed: Missing x-api-key header.');
      throw new UnauthorizedException('Missing API Key');
    }

    try {
      const authServerUrl =
        this.configService.get<string>('authServer.baseUrl');
      if (!authServerUrl) {
        this.logger.error(
          'Auth server URL is not configured. API key cannot be validated.',
        );
        throw new UnauthorizedException('Internal server configuration error.');
      }

      // Call the centralized auth server to validate the key
      await this.apiService.call({
        method: 'POST',
        baseUrl: authServerUrl,
        path: '/api-keys/validate',
        body: { apiKey },
      });

      // If the call succeeds (doesn't throw), the key is valid.
      next();
    } catch (error) {
      // The ApiService will throw a specific exception (like BadGatewayException).
      // We'll re-throw it as a standard UnauthorizedException for the client.
      throw new UnauthorizedException('Invalid API Key');
    }
  }
}
