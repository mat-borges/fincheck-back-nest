import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.listen(process.env.PORT ?? 3000);

    logger.log(`✅ Application running on Port: ${process.env.PORT ?? 3000}`);
  } catch (error) {
    logger.error('❌ Error during application bootstrap', error);
    process.exit(1);
  }
}

void bootstrap();
