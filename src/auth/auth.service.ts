import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService, 
    private jwtService: JwtService
  ) {}

  
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
    const { id, email, role } = user;
    return {
      id,
      email,
      role,
      access_token: this.jwtService.sign({ id: user.id, email: user.email, role: user.role })
    }
  }
}
