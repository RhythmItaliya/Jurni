import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { ENV_VARS } from '../config/env';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let app: any;

async function createNestApp() {
  if (!app) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    
    nestApp.enableCors();

    // Global validation pipe with detailed error messages
    nestApp.useGlobalPipes(
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

    const document = SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('api', nestApp, document);

    await nestApp.init();
    app = expressApp;
  }
  return app;
}

// For local development
async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);
  nestApp.enableCors();

  // Global validation pipe with detailed error messages
  nestApp.useGlobalPipes(
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

  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup('api', nestApp, document);

  await nestApp.listen(ENV_VARS.PORT);
  console.log(`Server running on http://localhost:${ENV_VARS.PORT}`);
}

// Export for Vercel
export default async (req: any, res: any) => {
  const server = await createNestApp();
  return server(req, res);
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}