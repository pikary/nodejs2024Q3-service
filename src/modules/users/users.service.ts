import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { SafeUser, User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = []; // In-memory storage

  create(createUserDto: CreateUserDto): SafeUser {
    const userExists = this.users.some(
      (user) => user.login === createUserDto.login,
    );
    // if (userExists) throw new ConflictException('User with this login exists');

    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  findAll(): User[] {
    return this.users.map(({ ...user }) => user);
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException('User not found');
    const { ...result } = user;
    return result;
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): SafeUser {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('Not found');
    }
    const { oldPassword, newPassword } = updatePasswordDto;
    if (user.password !== oldPassword) {
      throw new ForbiddenException('Password incorrect');
    }
    if (newPassword === oldPassword) {
      throw new BadRequestException('Passwords should differ');
    }
    Object.assign(user, {
      password: newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    const safeUser: SafeUser = {
      id: user.id,
      login: user.login,
      version: user.version,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
    return safeUser;
  }

  remove(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
  }
}
