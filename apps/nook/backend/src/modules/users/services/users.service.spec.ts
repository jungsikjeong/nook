import { DATABASE } from '@/db/db.service';
import { profiles } from '@/db/schema/profiles';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

type MockDb = {
  query: {
    users: { findFirst: jest.Mock };
    profiles: { findFirst: jest.Mock };
  };
  select: jest.Mock;
  limit: jest.Mock;
  update: jest.Mock;
  set: jest.Mock;
  where: jest.Mock;
};

function createMockDb(): MockDb {
  const where = jest.fn().mockResolvedValue(undefined);
  const set = jest.fn(() => ({ where }));
  const update = jest.fn(() => ({ set }));

  // findById의 select().from().leftJoin().where().limit() 체인 모킹
  const limit = jest.fn().mockResolvedValue([]);
  const selectWhere = jest.fn(() => ({ limit }));
  const leftJoin = jest.fn(() => ({ where: selectWhere }));
  const from = jest.fn(() => ({ leftJoin }));
  const select = jest.fn(() => ({ from }));

  return {
    query: {
      users: { findFirst: jest.fn() },
      profiles: { findFirst: jest.fn() },
    },
    select,
    limit,
    update,
    set,
    where,
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let db: MockDb;

  beforeEach(async () => {
    db = createMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: DATABASE, useValue: db }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('유저가 없으면 null을 리턴한다.', async () => {
      db.limit.mockResolvedValue([]);

      const result = await service.findById('non-existent-id');

      expect(result).toBeNull();
    });

    it('유저가 있으면 프로필을 합친 유저를 반환한다.', async () => {
      db.limit.mockResolvedValue([
        {
          users: {
            id: 'user-1',
            name: 'tester',
            email: 'test@example.com',
            emailVerified: false,
          },
          profiles: { userId: 'user-1', nickname: 'nick' },
        },
      ]);

      const result = await service.findById('user-1');

      expect(result).toMatchObject({
        id: 'user-1',
        name: 'tester',
        email: 'test@example.com',
        profile: { userId: 'user-1', nickname: 'nick' },
      });
    });

    it('프로필이 없으면 profile은 null이다.', async () => {
      db.limit.mockResolvedValue([
        {
          users: { id: 'user-1', name: 'tester', email: 'test@example.com' },
          profiles: null,
        },
      ]);

      const result = await service.findById('user-1');

      expect(result).toMatchObject({ id: 'user-1', profile: null });
    });
  });

  describe('getProfileByUserId', () => {
    it('유저 프로필이 없으면 null을 반환한다.', async () => {
      db.query.profiles.findFirst.mockResolvedValue(undefined);

      const result = await service.getProfileByUserId('non-existent-id');

      expect(result).toBeNull();
    });

    it('유저 프로필이 있으면 프로필을 반환한다.', async () => {
      db.query.profiles.findFirst.mockResolvedValue({
        userId: 'user-1',
        nickname: 'tester',
      });

      const result = await service.getProfileByUserId('user-1');

      expect(result).toMatchObject({
        userId: 'user-1',
        nickname: 'tester',
      });
    });
  });

  describe('updateProfile', () => {
    it('닉네임을 업데이트하면 업데이트된 프로필을 반환한다.', async () => {
      db.query.profiles.findFirst.mockResolvedValue({
        userId: 'user-1',
        nickname: 'new-nick',
      });

      const result = await service.updateProfile({
        updateDto: { userId: 'user-1', nickname: 'new-nick' },
      });

      expect(db.update).toHaveBeenCalledWith(profiles);
      expect(db.set).toHaveBeenCalledWith({ nickname: 'new-nick' });
      expect(result).toMatchObject({ userId: 'user-1', nickname: 'new-nick' });
    });

    it('파일이 있으면 이미지 경로가 업데이트된다.', async () => {
      db.query.profiles.findFirst.mockResolvedValue({
        userId: 'user-1',
        nickname: 'tester',
        image: '/uploads/profile/avatar.png',
      });

      const file = {
        path: 'uploads/profile/avatar.png',
      } as Express.Multer.File;

      const result = await service.updateProfile({
        updateDto: { userId: 'user-1', file },
      });

      expect(db.set).toHaveBeenCalledWith({
        image: '/uploads/profile/avatar.png',
      });
      expect(result).toMatchObject({
        userId: 'user-1',
        image: '/uploads/profile/avatar.png',
      });
    });

    it('프로필이 없으면 업데이트 후 null을 반환한다.', async () => {
      db.query.profiles.findFirst.mockResolvedValue(undefined);

      const result = await service.updateProfile({
        updateDto: { userId: 'user-1', bio: '안녕하세요' },
      });

      expect(db.set).toHaveBeenCalledWith({ bio: '안녕하세요' });
      expect(result).toBeNull();
    });
  });
});
