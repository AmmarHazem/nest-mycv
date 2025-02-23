import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create({ email, password }: { email: string; password: string }) {
    const user = this.userRepository.create({ email, password });
    await this.userRepository.save(user);
    return { user };
  }

  findOne({ id }: { id: number }) {
    if (!id) {
      return null;
    }
    return this.userRepository.findOne({ where: { id } });
  }

  find({ email }: { email: string }) {
    return this.userRepository.find({ where: { email } });
  }

  async update({
    email,
    id,
    password,
  }: {
    id: number;
    email?: string;
    password?: string;
  }) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, { email, password });
    await this.userRepository.save(user);
    return user;
  }

  async remove({ id }: { id: number }) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.userRepository.remove(user);
    return user;
  }
}
