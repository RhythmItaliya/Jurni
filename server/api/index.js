const { NestFactory } = require('@nestjs/core');
const { ValidationPipe, BadRequestException } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

let cachedApp;

async function createExpressApp() {
  if (cachedApp) {
    return cachedApp;
  }

  try {
    // Import modules dynamically to avoid build issues
    const { AppModule } = require('../dist/src/app.module');
    const { ENV_VARS } = require('../dist/config/env');

    const expressApp = express();
    
    const app = await NestFactory.create(
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

    await app.init();
    
    cachedApp = expressApp;
    return expressApp;
  } catch (error) {
    console.error('Failed to create NestJS app:', error);
    throw error;
  }
}

module.exports = async (req, res) => {
  try {
    // Set CORS headers for preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
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