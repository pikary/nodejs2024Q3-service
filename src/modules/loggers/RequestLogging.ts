import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './loggingService';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, query, body } = req;

    // Log the request details
    this.loggingService.log(
      `Request - Method: ${method}, URL: ${url}, Query: ${JSON.stringify(
        query,
      )}, Body: ${JSON.stringify(body)}`,
    );

    // Hook into the response to log the status code
    res.on('finish', () => {
      const { statusCode } = res;
      this.loggingService.log(
        `Response - Status Code: ${statusCode}, URL: ${url}`,
      );
    });

    next();
  }
}
