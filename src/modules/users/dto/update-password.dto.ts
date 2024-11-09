import { IsString, MinLength } from 'class-validator';

export class UpdatePassword {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

