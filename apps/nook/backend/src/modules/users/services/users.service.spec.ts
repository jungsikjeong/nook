import { DATABASE } from '@/db/db.service';
import { users } from '@/db/schema';
import { profiles } from '@/db/schema/profiles';
import { createTestDb, type TestDb } from '@/test/setup';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

// todo: db걷어내고 목업서비스로 변경
jest.setTimeout(30_000);

describe('UsersService', () => {
  let service: UsersService;
  let testDb: TestDb;

  beforeAll(async () => {
    testDb = await createTestDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: DATABASE, useValue: testDb.db }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  beforeEach(async () => {
    await testDb.db.delete(profiles);
    await testDb.db.delete(users);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('유저가 없으면 null을 리턴한다.', async () => {
      const result = await service.findById('non-existent-id');

      expect(result).toBeNull();
    });

    it('유저가 있으면 유저를 반환한다.', async () => {
      await testDb.db.insert(users).values({
        id: 'user-1',
        name: 'tester',
        email: 'test@example.com',
        emailVerified: false,
      });

      const result = await service.findById('user-1');

      expect(result).toMatchObject({
        id: 'user-1',
        name: 'tester',
        email: 'test@example.com',
      });
    });
  });

  describe('getProfileByUserId', () => {
    it('유저 프로필이 없으면 null을 반환한다.', async () => {
      const result = await service.getProfileByUserId('non-existent-id');

      expect(result).toBeNull();
    });

    it('유저 프로필이 있으면 프로필을 반환한다.', async () => {
      await testDb.db.insert(users).values({
        id: 'user-1',
        name: 'tester',
        email: 'test@example.com',
        emailVerified: false,
      });
      await testDb.db.insert(profiles).values({
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
    beforeEach(async () => {
      await testDb.db.insert(users).values({
        id: 'user-1',
        name: 'tester',
        email: 'test@example.com',
        emailVerified: false,
      });
    });

    it('닉네임을 업데이트하면 업데이트된 프로필을 반환한다.', async () => {
      await testDb.db.insert(profiles).values({
        userId: 'user-1',
        nickname: 'old-nick',
      });

      const result = await service.updateProfile({
        updateDto: { userId: 'user-1', nickname: 'new-nick' },
      });

      expect(result).toMatchObject({ userId: 'user-1', nickname: 'new-nick' });
    });

    it('파일이 있으면 이미지 경로가 업데이트된다.', async () => {
      await testDb.db.insert(profiles).values({
        userId: 'user-1',
        nickname: 'tester',
      });

      const file = {
        path: 'uploads/profile/avatar.png',
      } as Express.Multer.File;

      const result = await service.updateProfile({
        updateDto: { userId: 'user-1', file },
      });

      expect(result).toMatchObject({
        userId: 'user-1',
        image: '/uploads/profile/avatar.png',
      });
    });

    it('프로필이 없으면 업데이트 후 null을 반환한다.', async () => {
      const result = await service.updateProfile({
        updateDto: { userId: 'user-1', bio: '안녕하세요' },
      });

      expect(result).toBeNull();
    });
  });
});
