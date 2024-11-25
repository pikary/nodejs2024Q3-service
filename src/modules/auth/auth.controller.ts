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
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: CreateUserDto, @Res() res: Response) {
    // Logic to register a new user
    try {
      const newUser = await this.authService.signup(
        registerDto.login,
        registerDto.password,
      );
      return { message: 'User signed up successfully', user: newUser };
    } catch (error) {
      return res.status(error.status || HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Invalid request body',
      });
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any, @Res() res: Response) {
    const data = await this.authService.login(
      loginDto.login,
      loginDto.password,
    );
    res.status(HttpStatus.OK).json({
      user: data,
      message: 'User logged in successfully',
      token: 'your-jwt-token', // Replace with actual JWT
    });
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  getUserProfile(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    // Logic to fetch a user's profile by ID
    res.status(HttpStatus.OK).json({
      message: `Profile for user with ID ${id}`,
      data: {}, // Replace with actual user data
    });
  }
}
