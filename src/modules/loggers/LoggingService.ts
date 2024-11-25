import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BaseLogger } from './BaseLogger';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: BaseLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    this.loggingService.log(
      `Request - Method: ${method}, URL: ${originalUrl}, Query: ${JSON.stringify(
        query,
      )}, Body: ${JSON.stringify(body)}`,
    );

    // Hook into the response to log the status code
    res.on('finish', () => {
      const { statusCode } = res;
      this.loggingService.log(
        `Response - Status Code: ${statusCode}, URL: ${originalUrl}`,
      );
    });

    next();
  }
}
