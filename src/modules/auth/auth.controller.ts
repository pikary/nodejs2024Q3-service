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

@Controller('auth')
export class AuthController {
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: any, @Res() res: Response) {
    // Logic to register a new user
    res.status(HttpStatus.CREATED).json({
      message: 'User registered successfully',
      data: registerDto, // Replace with actual saved user data
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: any, @Res() res: Response) {
    // Logic to authenticate a user
    res.status(HttpStatus.OK).json({
      message: 'User logged in successfully',
      token: 'your-jwt-token', // Replace with actual JWT
    });
  }

  @Get('auth/refresh')
  @HttpCode(HttpStatus.OK)
  getUserProfile(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    // Logic to fetch a user's profile by ID
    res.status(HttpStatus.OK).json({
      message: `Profile for user with ID ${id}`,
      data: {}, // Replace with actual user data
    });
  }
}
