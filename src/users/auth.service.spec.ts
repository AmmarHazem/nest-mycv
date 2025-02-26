import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
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
  it('create new user with salted and hashed password', async () => {
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
});
