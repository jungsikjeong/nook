import type { NewUser } from '../../../database/schema/schema';

export type CreateUserDto = Pick<NewUser, 'email' | 'passwordHash' | 'name'>;
