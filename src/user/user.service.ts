import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    const existingUsername = await this.findByUsername(createUserDto.username);
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const token = this.jwtService.sign({ email: createUserDto.email });

    return { 
      user: await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        select: { id: true, email: true },
      }), 
      token 
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }


  async findOne(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}
