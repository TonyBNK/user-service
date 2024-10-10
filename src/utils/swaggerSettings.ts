import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export const swaggerSettings = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('User service API')
    .setDescription('User service API')
    .setVersion('1.0')
    .addBearerAuth({
      description: 'Enter JWT Bearer token only',
      type: 'http',
    })
    .addBasicAuth()
    .addApiKey(
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
        description:
          'JWT refreshToken inside cookie. Must be correct, and must not expire',
      },
      'refreshToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const swaggerDirectory = resolve('.', 'swagger');
  const swaggerFilePath = resolve(swaggerDirectory, 'swagger.yaml');

  if (!existsSync(swaggerDirectory)) {
    mkdirSync(swaggerDirectory);
  }

  const yaml = JSON.stringify(document, null, 2).replace(
    /\"(function[^"]+\")/g,
    '$1',
  );
  writeFileSync(swaggerFilePath, yaml);
};
