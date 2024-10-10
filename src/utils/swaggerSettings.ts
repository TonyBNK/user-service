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
  const swaggerYamlFilePath = resolve(swaggerDirectory, 'swagger.yaml');
  const swaggerMarkdownFilePath = resolve(swaggerDirectory, 'swagger.md');

  if (!existsSync(swaggerDirectory)) {
    mkdirSync(swaggerDirectory);
  }

  const yaml = JSON.stringify(document, null, 2).replace(
    /\"(function[^"]+\")/g,
    '$1',
  );
  writeFileSync(swaggerYamlFilePath, yaml);

  const markdown = `
# Swagger Specification

<details>
<summary>View Swagger YAML</summary>

\`\`\`yaml
${yaml}
\`\`\`

</details>

<iframe width="100%" height="500" frameborder="0" src="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/TonyBNK/user-service/dev/swagger/swagger.yaml"></iframe>
`;
  writeFileSync(swaggerMarkdownFilePath, markdown);
  writeFileSync(swaggerMarkdownFilePath, markdown);
};
