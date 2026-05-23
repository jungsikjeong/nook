# Domain Error Handling Guide

NestJS 앱에서 에러를 다룰 때의 기준입니다. 다른 AI나 개발자가 코드를 수정할 때 이 문서를 우선 참고하세요.

## 핵심 원칙

서비스는 HTTP를 몰라야 합니다.

- Controller / Guard / Pipe는 HTTP/API 경계의 책임을 가진다.
- Service는 비즈니스 로직과 데이터 흐름의 책임을 가진다.
- DomainError는 비즈니스 실패를 표현한다.
- ExceptionFilter는 DomainError를 HTTP 응답으로 변환한다.

즉, 서비스에서 바로 `NotFoundException`, `ConflictException`, `InternalServerErrorException` 같은 Nest HTTP exception을 던지는 코드는 가급적 피합니다.

## 현재 구조

공통 에러 타입과 필터는 `@nook/nest-common`에 있습니다.

- `packages/nest-common/src/errors/domain.error.ts`
- `packages/nest-common/src/filters/all-exceptions.filter.ts`

`AllExceptionsFilter`는 `DomainError` 계열을 다음 HTTP 상태로 매핑합니다.

| Domain error        | HTTP status                 |
| ------------------- | --------------------------- |
| `ConflictError`     | `409 Conflict`              |
| `NotFoundError`     | `404 Not Found`             |
| `UnauthorizedError` | `401 Unauthorized`          |
| `ForbiddenError`    | `403 Forbidden`             |
| `ValidationError`   | `400 Bad Request`           |
| 그 외 `DomainError` | `500 Internal Server Error` |

Nook backend와 auth server 모두 전역 필터로 `AllExceptionsFilter`를 사용합니다.

## 레이어별 책임

### Controller / Guard / Pipe

HTTP 요청과 응답에 묶인 책임을 처리합니다.

여기에 두는 것이 자연스러운 것:

- body/query/param validation
- 인증 실패
- 권한 실패
- `null` 조회 결과를 `404`로 변환
- 서비스의 특정 domain error를 HTTP 전용 상태로 변환
- legacy HTTP endpoint에 대한 `410 Gone`

예시:

```ts
const user = await this.users.findByIdWithProfile(current.sub);
if (!user) {
  throw new NotFoundException('User not found');
}
```

`findByIdWithProfile()` 입장에서 "없음"은 가능한 조회 결과입니다. 하지만 `/users/me` HTTP API 입장에서는 `404`가 맞으므로 controller에서 변환합니다.

Guard 예외도 HTTP boundary에 속하므로 괜찮습니다.

```ts
throw new UnauthorizedException('Authentication required');
throw new ForbiddenException('Insufficient permissions');
```

### Service

서비스는 비즈니스 로직, DB 조회/변경 orchestration, 도메인 규칙을 처리합니다.

서비스에서 권장하는 반환/예외:

- 조회 대상이 없을 수 있으면 `null` 반환
- 비즈니스 규칙 위반이면 `DomainError` 계열 throw
- 예상 불가능한 도메인 실패도 app-specific `DomainError`로 표현

예시:

```ts
export class ProfileInitializationFailedError extends DomainError {
  constructor(userId: string) {
    super(`Failed to initialize user profile: ${userId}`);
  }
}
```

```ts
if (!existing) {
  throw new ProfileInitializationFailedError(userId);
}
```

서비스에서 피해야 하는 코드:

```ts
throw new InternalServerErrorException('Failed to initialize user profile');
throw new ConflictException('이미 사용 중인 닉네임입니다.');
throw new GoneException('This endpoint is gone');
```

이런 exception은 HTTP 전송 방식에 묶입니다. 같은 서비스를 GraphQL, WebSocket, batch job, queue consumer에서 재사용할 때 의미가 어색해집니다.

### Exception Filter

공통 응답 포맷, 로깅, domain error -> HTTP status 매핑을 담당합니다.

새로운 app-specific domain error가 `ConflictError`, `NotFoundError` 같은 기존 타입으로 충분히 표현되면 그 타입을 상속하세요.

```ts
export class NicknameAlreadyTakenError extends ConflictError {
  constructor(nickname: string) {
    super(`Nickname already taken: ${nickname}`);
  }
}
```

기존 HTTP status로 충분하지 않은 특수한 경우만 controller에서 명시적으로 변환하거나, 공통 필터의 매핑을 확장합니다.

## 언제 Controller에서 직접 HTTP Exception을 던지나

다음은 controller/guard/pipe에서 HTTP exception을 던져도 됩니다.

- 요청 형식이 잘못됨: `BadRequestException`
- 인증이 없음: `UnauthorizedException`
- 권한이 없음: `ForbiddenException`
- API 리소스가 없음: `NotFoundException`
- HTTP endpoint 자체가 더 이상 제공되지 않음: `GoneException`

예시:

```ts
try {
  await this.authService.signUp(ctx, input);
} catch (error) {
  if (error instanceof LegacySignupDisabledError) {
    throw new GoneException(error.message);
  }

  throw error;
}
```

`LegacySignupDisabledError`는 서비스가 던지는 도메인 신호이고, `GoneException`은 HTTP endpoint의 응답 의미입니다.

## 새 에러를 추가할 때 체크리스트

1. 이 에러가 HTTP 요청 형식/인증/권한 문제인가?
   - 맞으면 controller/guard/pipe에서 HTTP exception 사용.
2. 이 에러가 비즈니스 규칙 위반인가?
   - 맞으면 `DomainError` 계열을 만든 뒤 service에서 throw.
3. 단순 조회에서 대상이 없는 케이스인가?
   - service는 `null` 반환, controller가 `404`로 변환.
4. 모든 API에서 같은 HTTP status로 표현되면?
   - `ConflictError`, `NotFoundError`, `ValidationError` 등 기존 domain error 상속.
5. 특정 HTTP endpoint에서만 다르게 표현해야 하면?
   - controller에서 해당 domain error를 catch해서 HTTP exception으로 변환.
6. 공통 응답 포맷이 필요하면?
   - `AllExceptionsFilter`에서 처리.

## AI 코드 작성 규칙

AI가 이 프로젝트의 NestJS 코드를 수정할 때는 다음을 지키세요.

- Service 파일에서 `@nestjs/common`의 `*Exception` import를 새로 추가하지 마세요.
- Service에서 HTTP status를 결정하지 마세요.
- Service에서 비즈니스 실패를 표현해야 하면 `DomainError` 계열 class를 추가하세요.
- Controller는 `null -> 404` 같은 API 의미 변환을 담당해도 됩니다.
- Guard는 인증/인가 실패에 대해 `UnauthorizedException`, `ForbiddenException`을 던져도 됩니다.
- 전역 에러 응답 포맷을 바꿔야 하면 `AllExceptionsFilter`를 수정하세요.
- 새 app-specific error는 관련 모듈의 `errors/` 디렉터리에 두세요.

## 프로젝트 예시

현재 코드의 대표 예시는 다음과 같습니다.

- `apps/nook/backend/src/modules/users/errors/profile-initialization-failed.error.ts`
- `apps/nook/backend/src/modules/users/services/users.service.ts`
- `apps/nook/backend/src/modules/auth/errors/legacy-signup-disabled.error.ts`
- `apps/nook/backend/src/modules/auth/controllers/auth.controller.ts`
- `packages/nest-common/src/filters/all-exceptions.filter.ts`

이 패턴을 기준으로 새 기능의 에러 처리를 맞추세요.
