import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private refreshTokens = new Map<string, string>(); // Store refresh tokens (keyed by user ID)

  async login(username: string, pass: string): Promise<any> {
    try {
      const user = this.usersService.findByLogin(username);
      const isMatch = await bcrypt.compare(pass, user?.password);
      if (!isMatch) {
        throw new UnauthorizedException();
      }
      const payload = { id: user.id, username: user.login };
      const { accessToken, refreshToken } = await this.generateTokens(payload);
      this.refreshTokens.set(user.id, refreshToken);
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      throw e;
    }
  }

  async signup(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = this.usersService.create({
      login: username,
      password: hashedPassword,
    });
    const payload = { id: newUser.id, username: newUser.login };
    const { accessToken, refreshToken } = await this.generateTokens(payload);
    this.refreshTokens.set(newUser.id, refreshToken);

    return { accessToken, refreshToken, ...newUser };
  }

  async generateTokens(user: any) {
    const payload = { username: user.username, id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store the refresh token securely
    // this.refreshTokens.set(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshtoken(refrshtoken: string) {
    try {
      const verify = await this.jwtService.verifyAsync(refrshtoken, {
        secret: 'secret',
      });
      const storedToken = this.refreshTokens.get(verify.id);
      if (!storedToken || storedToken !== refrshtoken) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const { refreshToken, accessToken } = await this.generateTokens({
        id: verify.id,
        login: verify.login,
      });
      // Update the stored refresh token
      this.refreshTokens.set(verify.id, refreshToken);

      return { accessToken, refreshToken };
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
