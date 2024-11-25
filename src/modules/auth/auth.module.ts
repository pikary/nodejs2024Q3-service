import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
@Module({
  controllers: [AuthController], // Registers the UserController
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, UsersService], // Registers the UsersService
  exports: [AuthService], // Exports UsersService if needed in other modules
})
export class AuthModule {}
