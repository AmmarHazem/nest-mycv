import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

it('can create instance of auth service', async () => {
  const fakeUsersService = {
    find: () => Promise.resolve([]),
    create: ({ email, password }: { email: string; password: string }) =>
      Promise.resolve({ id: 1, email, password }),
  };
  const module = await Test.createTestingModule({
    providers: [
      AuthService,
      { provide: UsersService, useValue: fakeUsersService },
    ],
  }).compile();
  const service = module.get(AuthService);
  expect(service).toBeDefined();
});
