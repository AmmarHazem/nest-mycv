import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> = {
      find: ({ email }) =>
        Promise.resolve(
          [
            { id: 2, email: 'test2@email.com', password: '123456' } as User,
          ].filter((user) => user.email === email),
        ),
      create: ({ email, password }: { email: string; password: string }) => {
        return Promise.resolve({ user: { id: 1, email, password } as User });
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();
    authService = module.get(AuthService);
  });
  it('can create instance of auth service', async () => {
    expect(authService).toBeDefined();
  });
  it('can create new user with salted and hashed password', async () => {
    const userEmail = 'test@email.com';
    const userPassword = '123456';
    const user = await authService.signup({
      email: userEmail,
      password: userPassword,
    });
    expect(user.email).toEqual(userEmail);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeTruthy();
    expect(hash).toBeTruthy();
  });
  it('will throw error when creating user with duplicate email', async () => {
    try {
      await authService.signup({
        email: 'test2@email.com',
        password: '123456',
      });
      throw new Error('Should not create a user');
    } catch (e) {
      expect(e instanceof BadRequestException).toEqual(true);
    }
  });
});
