import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';
import { RegisterDto, Role } from './dto/register.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService, 
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    const existingUsername = await this.userService.findByUsername(registerDto.username);
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const token = this.jwtService.sign({ 
      email: registerDto.email,
      role: registerDto.role || Role.USER
    });

    return { 
      user: await this.userService.create({
        ...registerDto,
        password: hashedPassword,
        role: registerDto.role || Role.USER,
      }), 
      token 
    };
  }

  
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (user){
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }


  async login(user: IUser) {
    const { id, email, role, username } = user;
    return {
      id,
      email,
      role,
      username,
      access_token: this.jwtService.sign({ id: user.id, email: user.email, role: user.role, username: user.username })
    }
  }
}
