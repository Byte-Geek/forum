import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const datasourceUrl = process.env.DATABASE_URL;
    if (!datasourceUrl) {
      throw new Error('DATABASE_URL env var is not set');
    }

    const adapter = new PrismaPg({ connectionString: datasourceUrl });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}