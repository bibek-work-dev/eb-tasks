import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Catch()
export class ErrorFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Interval Server Error';
    let error = 'Error';

    if (exception instanceof MongooseError.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid ${exception.path}: ${exception.value}`;
      error = 'Bad Request';
    } else if (exception instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = Object.values(exception.errors)
        .map((error) => error.message)
        .join(', ');
      error = 'Bad Request';
    } else if ((exception as any).code == '11000') {
      status = HttpStatus.CONFLICT;
      const duplicateKey = Object.keys((exception as any).keyValue || {}).join(
        ', ',
      );
      message = 'Duplicate Values';
      error = 'Conflict';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const resObject = exceptionResponse as any;
        message = resObject.message || message;
        error = resObject.error || exception.name;
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
      timeStamp: new Date().toISOString(),
    });
  }
}
