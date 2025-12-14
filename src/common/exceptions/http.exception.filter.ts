import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseMessages } from '../enums/ResponseMessages.enum';
import { BaseResponse } from 'src/base/response/base.response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let responseMessage: string;
    switch (status) {
      case 404:
        responseMessage = ResponseMessages.NOT_FOUND;
        break;
      case 500:
        responseMessage = ResponseMessages.INT_ERR;
        break;
      case 401:
        responseMessage = ResponseMessages.UNAUTH;
        break;
      case 403:
        responseMessage = ResponseMessages.UNAUTH;
        break;
      default:
        responseMessage = ResponseMessages.BAD_GTW + '|' + exception.message;
        break;
    }
    response
      .status(status)
      .json(new BaseResponse(null, responseMessage as ResponseMessages, false));
  }
}
