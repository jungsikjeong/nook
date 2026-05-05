import { Test, TestingModule } from '@nestjs/testing';
import { describe } from 'node:test';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { AppLogger } from '@/shared/logger/logger.service';
import { RequestContext } from '@/shared/request-context/request-context.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { Role } from '@/shared/enums/role.enum';

describe('AuthController', () => {
  let moduleRef: TestingModule;
  let authController: AuthController;

  const mockedAuthService = {
    signup: jest.fn(),
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

  describe('signup', () => {
    it('should signup new user', async () => {
      const signupDto = new SignUpDto();
      signupDto.loginId = 'testuser';
      signupDto.password = 'password123';
      signupDto.name = 'Test User';
      signupDto.nickname = 'testuser';
      signupDto.email = 'test@example.com';

      jest.spyOn(mockedAuthService, 'signup').mockResolvedValue(null);

      expect(await authController.signup(ctx, signupDto)).toBeNull();
    });
  });
});
