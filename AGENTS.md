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

## OIDC Architecture

Before editing auth, RP, IdP, Better Auth, OIDC, OAuth, session, or cookie behavior, read:

- `docs/oidc-architecture.md`

Keep the RP/IdP boundary clear. Nook is the RP; the auth app is the IdP.
