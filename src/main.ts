import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { appSettings } from 'src/utils/appSettings';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  appSettings(app);

  const port = app.get(ConfigService).get('PORT') || 8080;

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
