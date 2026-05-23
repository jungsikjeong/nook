import { DomainError } from '@nook/nest-common';

export class LegacySignupDisabledError extends DomainError {
  constructor() {
    super('Nook backend no longer owns signup. Use the IdP Better Auth endpoints.');
  }
}
