import { DATABASE } from '@/db/db.service';
import { AuthenticatedUser } from '@/shared/decorators/current-user.decorator';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockDb = {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: DATABASE, useValue: mockDb }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('유저가 없으면 null을 리턴한다.', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(undefined);

      const result = await service.findById('asddsa');

      expect(result).toBeNull();
    });

    it('유저가 있으면 유저를 반환한다.', async () => {
      const mockUser: AuthenticatedUser = {
        id: 'saas',
        sub: 'saas',
        email: 'test@example.com',
        name: 'tester',
        image: null,
      };
      mockDb.query.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.findById('asddsa');

      expect(result).toEqual(mockUser);
    });
  });
});
