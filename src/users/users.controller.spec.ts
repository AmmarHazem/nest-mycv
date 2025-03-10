import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  // let users: User[] = [
  //   { id: 1, email: 'akira@email.com', password: '12345' } as User,
  // ];
  beforeEach(async () => {
    fakeUsersService = {
      findOne({ id }) {
        return Promise.resolve({
          id,
          email: 'akira@email.com',
          password: '12345',
        } as User);
      },
      find({ email }) {
        return Promise.resolve([
          {
            id: 1,
            email: email,
            password: '12345',
          } as User,
        ]);
      },
      // remove({ id }) {
      //   const user = users.find((user) => user.id === id);
      //   if (!user) {
      //     throw new NotFoundException('user not found');
      //   }
      //   users = users.filter((user) => user.id !== id);
      //   return Promise.resolve(user);
      // },
      // update({ email, id, password }) {
      //   const user = users.find((user) => user.id === id);
      //   if (!user) {
      //     throw new NotFoundException('user not found');
      //   }
      // },
    };
    fakeAuthService = {
      // signup({ email, password }) {},
      signin({ email, password }) {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllUsers return list of all users with a specific email', async () => {
    const users = await controller.findAllUsers('akira@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('akira@email.com');
  });
  it('findUser get user with id', async () => {
    const user = await controller.findUser(1);
    expect(user.id).toEqual(1);
  });
  it('signin a user and sets userId on session', async () => {
    const session = { userId: null };
    const user = await controller.signin(
      {
        email: 'akira@email.com',
        password: '12345',
      },
      session,
    );
    expect(user.email).toEqual('akira@email.com');
    expect(user.id).toBeDefined();
    expect(session.userId).toEqual(1);
  });
});
