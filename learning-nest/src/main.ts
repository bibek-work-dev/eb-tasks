import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerInterceptor } from './common/interceptors/logger/logger.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { ValidateMongooseIdPipe } from './common/pipes/validate-mongoose-id/validate-mongoose-id.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
    // new ValidateMongooseIdPipe(),
  );
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log('Nest start bhayo hai');
}

bootstrap();
