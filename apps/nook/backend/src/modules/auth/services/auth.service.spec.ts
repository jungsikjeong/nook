import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger, RequestContext } from '@nook/nest-common';

import { ROLE } from '../constants/role.constant';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const signupDto: SignUpDto = {
    loginId: 'jhon',
    nickname: 'jhon',
    name: 'Jhon Doe',
    password: 'any password',
    roles: [ROLE.USER],
    email: 'randomUser@random.com',
  };

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  it('should reject legacy local signup', async () => {
    await expect(service.signUp(ctx, signupDto)).rejects.toThrow(
      'Nook backend no longer owns signup',
    );
  });
});
