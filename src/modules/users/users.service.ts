// src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto'
// import { UpdatePasswordDto } from './dto/update-password.dto';
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
      password:'',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users.map(({  ...user }) => user);
  }

  findOne(id: string): User {
    const user = this.users.find(user => user.id === id);
    if (!user) throw new NotFoundException('User not found');
    const {  ...result } = user;
    return result;
  }

//   updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): User {
//     const user = this.findOne(id);
//     if (user.password !== updatePasswordDto.oldPassword) {
//       throw new ConflictException('Incorrect old password');
//     }

//     user.password = updatePasswordDto.newPassword;
//     user.version += 1;
//     user.updateAt = Date.now();

//     const { password, ...result } = user;
//     return result;
//   }

  remove(id: string): void {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
  }
}
