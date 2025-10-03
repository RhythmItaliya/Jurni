import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ENV_VARS } from '@config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Global validation pipe with detailed error messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        // Extract validation error messages
        const messages = errors.map((error) => {
          const constraints = error.constraints;
          if (constraints) {
            return Object.values(constraints)[0]; // Get first constraint message
          }
          return `${error.property} is invalid`;
        });

        // Return first validation error message
        return new BadRequestException(messages[0]);
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Jurni Platform API')
    .setDescription('The Jurni Platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(ENV_VARS.PORT);
  console.log(`Server running on http://localhost:${ENV_VARS.PORT}`);
}

bootstrap();