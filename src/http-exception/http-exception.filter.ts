/**
 * 异常过滤器
 * 用于处理所有的 HttpException 异常
 */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message ? exception.message : 'Request failed';

    response.status(status).json({
      errno: -1,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
