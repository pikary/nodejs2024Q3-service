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
      return res.status(HttpStatus.CREATED).json({
        message: 'User signed up successfully',
        ...newUser,
      });
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
      ...data,
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshTokenDto: { refreshToken: string },
    @Res() res: Response,
  ) {
    try {
      if (!refreshTokenDto.refreshToken) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Refresh token is missing',
        });
      }

      const newTokens = await this.authService.refreshtoken(
        refreshTokenDto.refreshToken,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Token refreshed successfully',
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });
    } catch (error) {
      if (error.message === 'TokenExpiredError') {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: 'Refresh token expired',
        });
      }

      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'Invalid refresh token',
      });
    }
  }
}
