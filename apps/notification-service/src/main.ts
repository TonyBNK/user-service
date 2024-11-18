import { appSettings } from '@app/utils-lib';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule, {
    abortOnError: false,
  });
  const port = app.get(ConfigService).get('NOTIFICATION_SERVICE_PORT') || 8081;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
  });

  useContainer(app.select(NotificationModule), { fallbackOnErrors: true });

  appSettings(app);

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`Notification service is running on: ${await app.getUrl()}`);
}
bootstrap();
