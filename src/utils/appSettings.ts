import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../exception-filters';
import { ErrorResult } from '../types';

const validationExceptionFactory = (errors: Array<ValidationError>): never => {
  const errorResult: ErrorResult = {
    errorsMessages: errors.map(({ property, constraints }) => ({
      field: property,
      message: constraints ? Object.values(constraints)[0] : null,
    })),
  };

  throw new BadRequestException(errorResult);
};

export const appSettings = (app: INestApplication) => {
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter());
};