import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController], // Registers the UserController
  providers: [UsersService], // Registers the UsersService
  exports: [UsersService], // Exports UsersService if needed in other modules
})
export class UsersModule {}
