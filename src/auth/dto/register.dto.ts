import { IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Role {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'newuser@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'password123',
    minLength: 8,
  })
  @MinLength(8, {message: 'Password must be at least 8 characters long'})
  password: string;

  @ApiProperty({
    description: 'Username (min 3 characters)',
    example: 'newuser',
    minLength: 3,
  })
  username: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: Role,
    default: Role.USER,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
