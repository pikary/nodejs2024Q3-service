// src/users/users.controller.ts
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
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import {  UpdatePasswordDto} from './dto/update-password.dto';
  import { Response } from 'express';
  
  @Controller('user')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    // GET /user - get all users
    @Get()
    getAllUsers(@Res() res: Response) {
      const users = this.usersService.findAll();
      return res.status(HttpStatus.OK).json(users);
    }
  
    // GET /user/:id - get single user by id
    @Get(':id')
    getUserById(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Res() res: Response,
    ) {
      try {
        const user = this.usersService.findOne(id);
        return res.status(HttpStatus.OK).json(user);
      } catch (error) {
        return res.status(error.status || HttpStatus.NOT_FOUND).json({
          message: error.message || 'User not found',
        });
      }
    }
  
    // POST /user - create a new user
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
  
    // PUT /user/:id - update user's password
    @Put(':id')
    updateUserPassword(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updatePasswordDto: UpdatePasswordDto,
      @Res() res: Response,
    ) {
      try {
        const updatedUser = this.usersService.updatePassword(id, updatePasswordDto);
        return res.status(HttpStatus.OK).json(updatedUser);
      } catch (error) {
        
        return res.status(error.status || HttpStatus.NOT_FOUND).json({
          message: error.message || 'User not found',
        });
      }
    }
  
    // DELETE /user/:id - delete user
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUser(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Res() res: Response,
    ) {
      try {
        this.usersService.remove(id);
        return res.sendStatus(HttpStatus.NO_CONTENT);
      } catch (error) {
        return res.status(error.status || HttpStatus.NOT_FOUND).json({
          message: error.message || 'User not found',
        });
      }
    }
  }
  