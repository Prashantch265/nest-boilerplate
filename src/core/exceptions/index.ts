import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base Custom Exception extending NestJS HttpException.
 * Every custom exception will inherit from this.
 */
export class CustomHttpException extends HttpException {
  constructor(
    status: HttpStatus,
    message: string,
    public readonly source: unknown = null,
  ) {
    super(message, status);
  }
}

/**
 * AuthException: Authentication errors (401).
 */
export class AuthException extends CustomHttpException {
  constructor(message = 'Authentication error', source?: unknown) {
    super(HttpStatus.UNAUTHORIZED, message, source);
  }
}

/**
 * UnauthorizedException: Authorization errors 9403)
 */
export class UnauthorizedException extends CustomHttpException {
  constructor(message = 'Authorization error', source?: unknown) {
    super(HttpStatus.FORBIDDEN, message, source);
  }
}

/**
 * ValidationException: Input validation errors (422).
 * Carries structured validation errors in `source`.
 */
export class ValidationException extends CustomHttpException {
  constructor(
    message = 'Validation failed',
    source?: Record<string, string[]>, // type-safe structured errors
  ) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message, source);
  }
}

/**
 * DatabaseException: Database errors (500).
 */
export class DatabaseException extends CustomHttpException {
  constructor(message = 'Database error', source?: unknown) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, source);
  }
}

/**
 * NotFoundException: Resource not found (404).
 */
export class NotFoundException extends CustomHttpException {
  constructor(message = 'Resource not found', source?: unknown) {
    super(HttpStatus.NOT_FOUND, message, source);
  }
}

/**
 * ForbiddenException: Permission denied (403).
 */
export class ForbiddenException extends CustomHttpException {
  constructor(message = 'Access denied', source?: unknown) {
    super(HttpStatus.FORBIDDEN, message, source);
  }
}

/**
 * ConflictException: Data conflicts (409).
 */
export class ConflictException extends CustomHttpException {
  constructor(message = 'Conflict occurred', source?: unknown) {
    super(HttpStatus.CONFLICT, message, source);
  }
}

/**
 * BadGatewayException: Upstream service failure (502).
 */
export class BadGatewayException extends CustomHttpException {
  constructor(message = 'Bad Gateway', source?: unknown) {
    super(HttpStatus.BAD_GATEWAY, message, source);
  }
}

/**
 * ServiceUnavailableException: Service unavailable (503).
 */
export class ServiceUnavailableException extends CustomHttpException {
  constructor(message = 'Service Unavailable', source?: unknown) {
    super(HttpStatus.SERVICE_UNAVAILABLE, message, source);
  }
}
