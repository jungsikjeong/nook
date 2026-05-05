import { HttpException } from '@nestjs/common';

export class BaseApiException extends HttpException {
  public localizedMessage: Record<string, string> | undefined;
  public details: string | Record<string, any> | undefined;

  constructor(
    message: string,
    status: number,
    details?: string | Record<string, any>,
    localizedMessage?: Record<string, string>,
  ) {
    // 기본 Exception 클래스의 부모 생성자를 호출합니다.
    super(message, status);
    this.name = BaseApiException.name;
    this.localizedMessage = localizedMessage;
    this.details = details;
  }
}
