import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
  Res,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Response } from 'express';
import { isUUID } from 'class-validator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(@Res() res: Response) {
    const users = this.usersService.findAll();
    return res.status(HttpStatus.OK).json(users);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    if (isUUID(id)) {
      const user = this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } else {
      throw new BadRequestException('Not Valid ID');
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const newUser = this.usersService.create(createUserDto);
      return res.status(HttpStatus.CREATED).json(newUser);
    } catch (error) {
      return res.status(error.status || HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Invalid request body',
      });
    }
  }

  @Put(':id')
  updateUserPassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    try {
      const updatedUser = this.usersService.updatePassword(
        id,
        updatePasswordDto,
      );
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      console.log(error);

      return res.status(error.status).json({
        message: error.message,
      });
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): void {
    this.usersService.remove(id);
  }
}
