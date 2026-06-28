# Agent Instructions

This file is the entry point for AI agents working in this repository.

## NestJS Error Handling

Before editing NestJS backend code, read:

- `docs/domain-error-handling.md`

Key rules:

- Services should not throw Nest HTTP exceptions directly.
- Use `DomainError` for business failures.
- Controllers, guards, pipes, and filters handle HTTP mapping.
- Return `null` from services when "not found" is a normal lookup result, then map it to `404` at the controller boundary.
- Put new app-specific domain errors in the relevant module's `errors/` directory.

Relevant shared files:

- `packages/nest-common/src/errors/domain.error.ts`
- `packages/nest-common/src/filters/all-exceptions.filter.ts`

## Backend ↔ Frontend Type Sharing

The frontend shares types with the backend through an OpenAPI spec.

- Backend DTOs are zod schemas wrapped with `createZodDto` (nestjs-zod). Do **not** use
  `class-validator` / `class-transformer`.
- The backend emits `apps/nook/backend/openapi.json` via `pnpm --filter @nook/backend openapi:gen`
  (`scripts/generate-openapi.ts`, runs in Nest `preview` mode so no DB connection is needed).
- The frontend generates types from that spec into `src/lib/api/generated/` via
  `pnpm --filter @nook/frontend gen:api` (`@hey-api/openapi-ts`, types only — the BFF fetch
  client in `src/lib/api/server.ts` stays the transport).

Regenerate both with one command after any backend route/DTO change:

```bash
pnpm nook-gen:types
```

When adding a controller/module, the route is scanned automatically once it is wired into
`AppModule`. For good types, annotate the endpoint:

- Request body: `@Body() dto: XxxDto` (DTO = `createZodDto(schema)`).
- Response: `@ApiOkResponse({ type: XxxResDto })` — Drizzle `$inferSelect` types and
  un-annotated returns are **not** picked up, so always declare a response DTO.
- Multipart: `@ApiConsumes('multipart/form-data')` + `@ApiBody({ type })`.

Response DTOs model the **wire format** (post-JSON), so date columns are `z.string()`, not
`z.date()`. We use docs-only `@ApiOkResponse` rather than nestjs-zod `@ZodResponse` because
controllers return raw Drizzle entities (`Date` objects, entity shape) that do not match the
wire DTO; `@ZodResponse` would enforce that match at compile- and run-time and require an
entity→DTO mapping layer first.

## OIDC Architecture

Before editing auth, RP, IdP, Better Auth, OIDC, OAuth, session, or cookie behavior, read:

- `docs/oidc-architecture.md`

Keep the RP/IdP boundary clear. Nook is the RP; the auth app is the IdP.
