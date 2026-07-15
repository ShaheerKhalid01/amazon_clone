import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');   // 👈 YE LINE ADD KAREIN
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Server on port ${port}`);
}
bootstrap();