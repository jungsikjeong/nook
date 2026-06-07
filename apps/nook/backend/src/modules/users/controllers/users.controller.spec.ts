import { type AuthenticatedUser } from '@/shared/decorators/current-user.decorator';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundError } from '@nook/nest-common';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  const mockUser: AuthenticatedUser = {
    id: 'saas',
    sub: 'saas',
    email: 'test@example.com',
    name: 'tester',
    image: '',
  };

  let controller: UsersController;

  const mockUsersService = {
    findById: jest.fn(),
    getProfileByUserId: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET: findById', () => {
    it('유저가 없으면 NotFoundException을 던져야 한다.', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(controller.findById(mockUser)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('유저가 있으면 유저를 반환한다.', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.findById(mockUser);

      expect(result).toEqual(mockUser);
    });
  });

  describe('GET: getProfileByUserId', () => {
    it('getProfile은 userId를 인자로 서비스를 호출해야 한다.', async () => {
      mockUsersService.getProfileByUserId.mockResolvedValue(null);

      await controller.getProfile(mockUser);

      expect(mockUsersService.getProfileByUserId).toHaveBeenCalledWith(
        mockUser.sub,
      );
    });

    it('유저 프로필에 등록된게 없으면 usersService로부터 null을 반환받아야한다.', async () => {
      mockUsersService.getProfileByUserId.mockResolvedValue(null);

      const result = await controller.getProfile(mockUser);

      expect(result).toBeNull();
    });

    it('유저 프로필에 등록된게 있다면 유저의 프로필을 반환받아 리턴해야한다.', async () => {
      const userProfile = {
        userId: '2222',
        nickname: 'ewrwx',
        image: '',
        bio: '',
      };

      mockUsersService.getProfileByUserId.mockResolvedValue(userProfile);

      const result = await controller.getProfile(mockUser);

      expect(result).toEqual(userProfile);
    });
  });
});
