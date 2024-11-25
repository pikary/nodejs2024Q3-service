import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
@Module({
  controllers: [AuthController], // Registers the UserController
  providers: [AuthService, UsersService], // Registers the UsersService
  exports: [AuthService], // Exports UsersService if needed in other modules
})
export class UsersModule {}
