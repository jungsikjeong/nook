import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger, RequestContext } from '@nook/nest-common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: AppLogger, useValue: mockedLogger }],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();
});
