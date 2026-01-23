import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['https://forum-production-b9a9.up.railway.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });


  const config = new DocumentBuilder()
    .setTitle('Forum API')
    .setDescription('API documentation for Forum application')
    .setVersion('1.0')
    .addTag('Forum')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
