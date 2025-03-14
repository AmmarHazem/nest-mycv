import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  const user = { id: 2, email: 'test2@email.com', password: '123456' } as User;
  const user2 = {
    id: 3,
    email: 'test3@email.com',
    password:
      'cefe4d3c878a4c2a.c8e63c2cf13ef5a72906289c0158c5fbed1ce265fdb50fcf9c23004915695ad6',
  } as User;
  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> & { users: User[] } = {
      users: [user, user2],
      find({ email }: { email: string }) {
        return Promise.resolve(
          this.users?.filter((user) => user.email === email),
        );
      },
      create({ email, password }: { email: string; password: string }) {
        const newUser = { id: 1, email, password } as User;
        this.users.push(newUser);
        return Promise.resolve({ user: newUser });
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
        email: user.email,
        password: user.password,
      });
      throw new Error('Should not create a user');
    } catch (e) {
      expect(e instanceof BadRequestException).toEqual(true);
    }
  });
  it('will thow error when signing in with invalid email', async () => {
    expect(
      authService.signin({
        email: 'abc@email.com',
        password: '123456',
      }),
    ).rejects.toThrow(BadRequestException);
  });
  it('will throw error when signing in with invalid password', async () => {
    expect(
      authService.signin({
        email: 'test2@email.com',
        password: '123455',
      }),
    ).rejects.toThrow(BadRequestException);
  });
  it('will sign in user', async () => {
    const user = { email: 'test123@email.com', password: '12345' };
    await authService.signup(user);
    const signInUser = await authService.signin({
      email: user.email,
      password: user.password,
    });
    expect(signInUser.email).toEqual(user.email);
  });
});
