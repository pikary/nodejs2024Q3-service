import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController], // Registers the UserController
  providers: [UsersService, JwtService], // Registers the UsersService
  exports: [UsersService], // Exports UsersService if needed in other modules
})
export class UsersModule {}
