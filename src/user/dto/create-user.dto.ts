import { IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';

enum Role {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8, {message: 'Password must be at least 8 characters long'})
  password: string;

  username: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
