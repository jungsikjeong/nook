# Claude Instructions

This repository also has shared agent instructions in:

- `AGENTS.md`

Follow `AGENTS.md` for repository-wide rules.

## NestJS Error Handling

Before editing NestJS backend code, read:

- `docs/domain-error-handling.md`

Key rule:

- Services should not throw Nest HTTP exceptions directly.
- Use `DomainError` for business failures.
- Controllers, guards, pipes, and filters handle HTTP mapping.

## Auth / OIDC

Before editing auth, RP, IdP, Better Auth, OIDC, OAuth, session, or cookie behavior, read:

- `docs/oidc-architecture.md`
