import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { REQUEST_ID_TOKEN_HEADER } from '../constants';
import { BaseApiException } from '../exceptions/base-api.exception';
import { AppLogger } from '../logger/logger.service';
import { createRequestContext } from '../request-context/util';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  /** 로거 컨텍스트 설정 */
  constructor(
    private config: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: T, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest<Request>();
    const res: Response = ctx.getResponse<Response>();

    const path = req.url;
    const timestamp = new Date().toISOString();
    const requestId = req.headers[REQUEST_ID_TOKEN_HEADER];
    const requestContext = createRequestContext(req);

    let stack: any;
    let statusCode: HttpStatus | undefined = undefined;
    let errorName: string | undefined = undefined;
    let message: string | undefined = undefined;
    let details: string | Record<string, any> | undefined = undefined;
    // TODO : 헤더의 언어 값에 따라 현지화된(localized) 메시지를 반환하도록 개선 필요
    const acceptedLanguage = 'ja';
    let localizedMessage: string | undefined = undefined;

    // TODO : 아래 분기들을 switch 문으로 리팩토링하고 에러 응답 생성 로직을 정리할 것
    if (exception instanceof BaseApiException) {
      statusCode = exception.getStatus();
      errorName = exception.constructor.name;
      message = exception.message;
      localizedMessage = exception.localizedMessage
        ? exception.localizedMessage[acceptedLanguage]
        : undefined;
      details = exception.details || exception.getResponse();
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorName = exception.constructor.name;
      message = exception.message;
      details = exception.getResponse();
    } else if (exception instanceof Error) {
      errorName = exception.constructor.name;
      message = exception.message;
      stack = exception.stack;
    }

    // 위의 어떤 분기에도 해당하지 않는 경우 기본값으로 500 (Internal Server Error)으로 설정
    statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    errorName = errorName || 'InternalException';
    message = message || 'Internal server error';

    // 참고: 에러 응답 포맷은 https://cloud.google.com/apis/design/errors 가이드 참조
    const error = {
      statusCode,
      message,
      localizedMessage,
      errorName,
      details,
      // 우리가 추가로 덧붙인 메타 정보
      path,
      requestId,
      timestamp,
    };
    this.logger.warn(requestContext, error.message, {
      error,
      stack,
    });

    // 운영(prod) 환경에서는 500 에러의 원본 상세 메시지를 노출하지 않고 일반 메시지로 가린다 (보안)
    const isProMood = this.config.get<string>('env') !== 'development';
    if (isProMood && statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      error.message = 'Internal server error';
    }

    res.status(statusCode).json({ error });
  }
}
