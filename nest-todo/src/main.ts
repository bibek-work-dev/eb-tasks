import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphqlExceptionFilter } from './commons/filters/graphql-exception/graphql-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GraphqlExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running in PORT ${process.env.PORT || 3000} `);
}
bootstrap();
