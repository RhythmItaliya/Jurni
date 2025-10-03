import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ENV_VARS } from '../config/env';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { INestApplication } from '@nestjs/common';

let cachedApp: express.Express;

async function createExpressApp(): Promise<express.Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  
  try {
    const app: INestApplication = await NestFactory.create(
      AppModule, 
      new ExpressAdapter(expressApp),
      {
        logger: process.env.NODE_ENV === 'production' ? false : ['log', 'error', 'warn'],
      }
    );
    
    app.enableCors({
      origin: ENV_VARS.CORS_ORIGIN || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
          const messages = errors.map((error) => {
            const constraints = error.constraints;
            if (constraints) {
              return Object.values(constraints)[0];
            }
            return `${error.property} is invalid`;
          });
          return new BadRequestException(messages[0]);
        },
      }),
    );

    // Only setup Swagger in development
    if (process.env.NODE_ENV !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('Jurni Platform API')
        .setDescription('The Jurni Platform API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);
    }

    await app.init();
    
    cachedApp = expressApp;
    return expressApp;
  } catch (error) {
    console.error('Failed to create NestJS app:', error);
    throw error;
  }
}

export default async (req: any, res: any) => {
  try {
    // Set CORS headers for preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', ENV_VARS.CORS_ORIGIN || '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      return res.status(200).end();
    }

    const app = await createExpressApp();
    return app(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// For local development
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
          const messages = errors.map((error) => {
            const constraints = error.constraints;
            if (constraints) {
              return Object.values(constraints)[0];
            }
            return `${error.property} is invalid`;
          });
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
}

bootstrap();
