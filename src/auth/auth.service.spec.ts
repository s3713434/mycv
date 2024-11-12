import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { hashPassword } from '../utils/hashPassword';

jest.mock('../utils/hashPassword', () => ({
  hashPassword: jest
    .fn()
    .mockReturnValue(Promise.resolve('salt.hashedPassword')),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: jest.fn(),
      create: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  describe('signup', () => {
    it('should throw an error if email is already in use', async () => {
      (fakeUsersService.find as jest.Mock).mockResolvedValue([
        { id: 1, email: 'test@test.com', password: 'hashedPassword' },
      ]);

      await expect(
        authService.signup('test@test.com', 'password'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a new user with hashed password', async () => {
      (fakeUsersService.find as jest.Mock).mockResolvedValue([]);
      (fakeUsersService.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'salt.hashedPassword',
      });

      const user = await authService.signup('test@test.com', 'password');

      expect(user).toEqual({
        id: 1,
        email: 'test@test.com',
        password: 'salt.hashedPassword',
      });
      expect(hashPassword).toHaveBeenCalledWith('password');
    });
  });

  describe('signin', () => {
    it('should throw an error if user is not found', async () => {
      (fakeUsersService.find as jest.Mock).mockResolvedValue([]);

      await expect(
        authService.signin('test@test.com', 'password'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if password is incorrect', async () => {
      (fakeUsersService.find as jest.Mock).mockResolvedValue([
        { id: 1, email: 'test@test.com', password: 'salt.hashedPassword' },
      ]);

      await expect(
        authService.signin('test@test.com', 'wrongpassword'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return a user if correct password is provided', async () => {
      (fakeUsersService.find as jest.Mock).mockResolvedValue([
        { id: 1, email: 'test@test.com', password: 'salt.hashedPassword' },
      ]);

      const user = await authService.signin('test@test.com', 'password');

      expect(user).toEqual({
        id: 1,
        email: 'test@test.com',
        password: 'salt.hashedPassword',
      });
    });
  });
});
