import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger, RequestContext } from '@nook/nest-common';

import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let moduleRef: TestingModule;
  let authController: AuthController;

  const mockedAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockedAuthService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('정의되어 있어야한다.', () => {
    expect(authController).toBeDefined();
  });

  const ctx = new RequestContext();
});
