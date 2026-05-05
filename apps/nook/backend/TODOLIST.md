# Backend TODO

## 로거

- [ ] 로깅 시스템 도입 (NestJS Logger 또는 winston/pino)
- [ ] 요청/응답 로깅 인터셉터
- [ ] 에러 로깅 필터
- [ ] 환경별 로그 레벨 설정 (dev / prod)

## 리프레시 토큰

- [ ] `refresh_tokens` 테이블 스키마 추가 (Drizzle)
- [ ] `signIn` / `signUp` 시 access + refresh 토큰 동시 발급
- [ ] refresh 토큰을 별도 HttpOnly 쿠키로 저장
- [ ] `POST /auth/refresh` 엔드포인트 구현
- [ ] `signOut` 시 refresh 토큰 DB 무효화
- [ ] 토큰 회전(rotation) 정책 결정
- [ ] access 토큰 만료시간 단축 (현재 7d → 15m 권장)

  ▎ 참고: 실무에서는 보통 nestjs-i18n 같은 전용 라이브러리를 쓰는 경우가 더 많습니다. 메시지를 코드 안에 박지 않고 i18n/ko.json, i18n/en.json 같은 파일로 분리해서 관리할 수 있어서
  ▎ 번역가와 협업하기 쉽거든요.
