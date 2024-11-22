import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SafeUser } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    // Check if the user already exists
    const userExists = await this.userRepository.findOneBy({
      login: createUserDto.login,
    });
    if (userExists) {
      throw new ConflictException('User with this login already exists');
    }

    // Create a new user
    const newUser = this.userRepository.create({
      login: createUserDto.login,
      password: createUserDto.password,
    });
    console.log(newUser);

    const savedUser = await this.userRepository.save(newUser);

    const { password, ...safeUser } = savedUser;
    return safeUser; // Return the user without the password
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...safeUser }) => safeUser); // Exclude passwords
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<SafeUser> {
    const { oldPassword, newPassword } = updatePasswordDto;

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the old password matches
    if (user.password !== oldPassword) {
      throw new ForbiddenException('Password is incorrect');
    }

    // Check if the new password is different
    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'New password must differ from old password',
      );
    }

    // Update the user's password and increment version
    user.password = newPassword;
    user.version += 1;
    user.updatedAt = new Date();

    const updatedUser = await this.userRepository.save(user);
    const { password, ...safeUser } = updatedUser;

    return safeUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
