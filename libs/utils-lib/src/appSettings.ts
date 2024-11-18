import { HttpExceptionFilter } from '@app/exception-filters-lib';
import { ErrorResult } from '@app/types-lib';
import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';

const validationExceptionFactory = (errors: Array<ValidationError>): never => {
  const errorResult: ErrorResult = {
    errorsMessages: errors.map(({ property, constraints }) => ({
      field: property,
      message: constraints ? Object.values(constraints)[0] : null,
    })),
  };

  throw new BadRequestException(errorResult);
};

export const appSettings = (
  app: INestApplication,
  swaggerSettings?: (app: INestApplication) => void,
) => {
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

  if (swaggerSettings) {
    swaggerSettings(app);
  }
};
