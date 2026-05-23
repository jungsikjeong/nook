import { DomainError } from '@nook/nest-common';

export class ProfileInitializationFailedError extends DomainError {
  constructor(userId: string) {
    super(`Failed to initialize user profile: ${userId}`);
  }
}
