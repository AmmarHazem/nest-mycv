import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup({ email, password }: { email: string; password: string }) {
    const users = await this.usersService.find({ email });
    if (users.length) {
      throw new BadRequestException('email already registered');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const user = await this.usersService.create({ email, password: result });
    return user.user;
  }

  async signin({ email, password }: { email: string; password: string }) {
    const [user] = await this.usersService.find({ email });
    if (!user) {
      throw new BadRequestException('invalid credentails');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('invalid credentails');
    }
    return user;
  }
}
