import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = this.usersService.findOne(username);
      if (user?.password !== pass) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user.id, username: user.login };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      throw e;
    }
  }

  async signup(username: string, password: string) {
    const newUser = this.usersService.create({
      login: username,
      password: password,
    });
    const { accessToken, refreshToken } = await this.generateTokens({
      login: newUser.login,
      password: newUser.id,
    });
    return { ...newUser, accessToken, refreshToken };
  }

  async generateTokens(user: any) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store the refresh token securely
    // this.refreshTokens.set(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}
