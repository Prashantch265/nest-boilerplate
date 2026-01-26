import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  AxiosRequestConfig,
  Method,
  RawAxiosRequestHeaders,
  ResponseType,
} from 'axios';
import { catchError, firstValueFrom, retry, timeout } from 'rxjs';

interface ApiCallOptions {
  method: Method;
  baseUrl: string;
  path: string;
  body?: any;
  requestHeaders?: RawAxiosRequestHeaders;
  responseType?: ResponseType;
  authToken?: string;
  timeout?: number;
  retry?: number;
}

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  private readonly defaultHeaders: RawAxiosRequestHeaders = {
    'Content-Type': 'application/json',
  };

  constructor(private readonly httpService: HttpService) {}

  async call<T = any>(options: ApiCallOptions) {
    const headers: RawAxiosRequestHeaders = {
      ...this.defaultHeaders,
      ...options.requestHeaders,
    };

    if (options?.authToken) {
      headers['Authorization'] = `Bearer ${options.authToken}`;
    }

    const config: AxiosRequestConfig = {
      method: options.method,
      baseURL: options.baseUrl,
      url: options.path,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: options.body ?? null,
      headers,
      responseType: options.responseType ?? 'json',
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    const response = await firstValueFrom(
      this.httpService.request<T>(config).pipe(
        timeout(options?.timeout ?? 5000),
        retry(options?.retry ?? 1),
        catchError((error) => {
          // log ONCE with stack
          this.logger.error(
            `API request failed: ${error?.message || error}`,
            error?.stack,
          );

          // Map error types → custom exceptions
          if (error?.code === 'ECONNREFUSED') {
            throw new ServiceUnavailableException(
              'Target service unavailable',
              error,
            );
          }
          if (error?.code === 'ETIMEDOUT') {
            throw new ServiceUnavailableException('Request timed out', error);
          }
          if (error?.response?.status) {
            throw new BadGatewayException(
              `Upstream service returned ${error.response.status}`,
              error,
            );
          }

          // fallback
          throw new ServiceUnavailableException(
            'Unexpected API failure',
            error,
          );
        }),
      ),
    );
    return response.data;
  }
}
