import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin:
      configService.get('NODE_ENV') == 'production'
        ? 'https://quiz-ops-frontend.vercel.app'
        : 'http://localhost:5173',
    credentials: true,
  });

  app.use(cookieParser());

  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
}
bootstrap();
