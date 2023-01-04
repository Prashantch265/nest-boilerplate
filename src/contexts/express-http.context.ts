/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-22 22:29:01
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-22 22:57:37
 */

import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import httpContext from 'express-http-context';

@Injectable()
export class RequestContextProvider {
  get(key) {
    return httpContext.get(key);
  }

  set(key, value) {
    return httpContext.set(key, value);
  }
}

/**
 * Express HTTP Context
 * Get and set request-scoped context anywhere. This is just an unopinionated, idiomatic ExpressJS implementation of cls-hooked (forked from continuation-local-storage).
 * It's a great place to store user state, claims from a JWT, request/correlation IDs, and any other request-scoped data. Context is preserved even over async/await.
 * https://www.npmjs.com/package/express-http-context#how-to-use-it
 */
@Injectable()
export class HttpContextMiddleware implements NestMiddleware {
  constructor(private requestContextProvider: RequestContextProvider) {}
  use(req: Request, res: Response, next: NextFunction) {
    httpContext.middleware(req, res, () => {
      next();
    });
  }
}
