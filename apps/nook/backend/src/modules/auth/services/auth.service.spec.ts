import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger, RequestContext } from '@nook/nest-common';

import { UsersService } from '@/modules/users/services/users.service';

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

  const userOutput = { ...signupDto, id: 'anyId' };

  const mockedUserService = {
    findById: jest.fn(),
    createUser: jest.fn(),
    validateUsernamePassword: jest.fn(),
  };

  const mockedJwtService = {
    sign: jest.fn(),
  };

  const mockedConfigService = { get: jest.fn() };

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockedUserService },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  it('should sign up a new user', async () => {
    jest
      .spyOn(mockedUserService, 'createUser')
      .mockImplementation(() => userOutput);

    const result = await service.signUp(ctx, signupDto);

    expect(mockedUserService.createUser).toHaveBeenCalledWith(ctx, signupDto);
    expect(result).toEqual({ userOutput });
  });
});
