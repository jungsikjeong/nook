# nook

## Structure

```
nook/
  apps/
    frontend/        # Next.js (App Router)
  pnpm-workspace.yaml
```

## Scripts

```bash
pnpm dev:frontend        # 프론트엔드 개발 서버
pnpm build               # 전체 빌드
pnpm lint                # 전체 lint
pnpm typecheck           # 전체 타입체크
```

## TODO

- [ ] **컬러/사이즈 토큰화** — `#dbe7d8`, `#f3f3f3`, `w-115` 등 흩어진 값들을 `globals.css`의 `@theme`에 토큰으로 정의. 디자인 일관성 + 다크모드 확장 대비.
  ```css
  @theme {
    --color-canvas: #f3f3f3;
    --color-card: #dbe7d8;
  }
  ```
