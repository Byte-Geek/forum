import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

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

  async create(userData: any) {
    return this.prisma.user.create({
      data: userData,
      select: { id: true, email: true, username: true, role: true },
    });
  }
}
