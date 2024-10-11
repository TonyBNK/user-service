import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { UserViewModel } from '../../src/common/types/view/user';
import { basicAuth, bearerAuth, createTestApp, getRouterPaths } from '../utils';
import { createValidUsersInput } from '../utils/create-valid-users-input';

describe('Users e2e', () => {
  const password = '1234567';
  const invalidAccessToken = 'invalid_access_token';
  const routerPaths = getRouterPaths('/api/v1');

  let app: INestApplication;
  let server: App;
  let user: UserViewModel | null = null;
  let accessToken: string = '';

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();

    await request(server)
      .delete(`${routerPaths.testing}/all-data`)
      .expect(HttpStatus.NO_CONTENT);

    const [userDto] = createValidUsersInput(1);

    const userResponse = await request(server)
      .post(routerPaths.users_sa)
      .set(basicAuth)
      .send(userDto)
      .expect(HttpStatus.CREATED);

    user = userResponse.body;

    const loginResponse = await request(server)
      .post(`${routerPaths.auth}/login`)
      .send({
        loginOrEmail: user!.login,
        password,
      })
      .expect(HttpStatus.OK);

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await request(server)
      .delete(`${routerPaths.testing}/all-data`)
      .expect(HttpStatus.NO_CONTENT);

    await app.close();
  });

  describe('- GET Users', () => {
    it('should return status 401 without authorization', async () => {
      await request(server)
        .get(routerPaths.users)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 401 if access token is invalid', async () => {
      await request(server)
        .get(routerPaths.users)
        .set(bearerAuth(invalidAccessToken))
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('+ GET Users', () => {
    it('should return users with status 200', async () => {
      const response = await request(server)
        .get(routerPaths.users)
        .set(bearerAuth(accessToken))
        .expect(HttpStatus.OK);

      expect(response.body.totalCount).toEqual(1);
      expect(response.body.items.length).toEqual(1);
    });
  });
});
