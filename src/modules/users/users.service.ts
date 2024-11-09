import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { SafeUser, User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = []; // In-memory storage

  create(createUserDto: CreateUserDto): User {
    const userExists = this.users.some(user => user.login === createUserDto.login);
    if (userExists) throw new ConflictException('User with this login exists');

    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: '',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users.map(({ ...user }) => user);
  }

  findOne(id: string): User {
    const user = this.users.find(user => user.id === id);
    if (!user) throw new NotFoundException('User not found');
    const { ...result } = user;
    return result;
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): SafeUser {
    const user = this.findOne(id)
    const { oldPassword, newPassword } = updatePasswordDto
    if (!user) {
      throw new NotFoundException('User not found')
    }
    if (user.password !== oldPassword) {
      throw new ForbiddenException('Password incorrect')
    }
    if (newPassword === oldPassword) {
      throw new BadRequestException('Passwords should differ')
    }
    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const { password, ...result } = user;
    return result;
  }

  remove(id: string): void {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
  }
}
