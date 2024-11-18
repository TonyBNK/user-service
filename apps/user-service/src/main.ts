import { appSettings } from '@app/utils-lib';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { swaggerSettings } from 'apps/user-service/src/utils/swaggerSettings';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const port = app.get(ConfigService).get('USER_SERVICE_PORT') || 8080;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  appSettings(app, swaggerSettings);

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`User service is running on: ${await app.getUrl()}`);
}
bootstrap();
