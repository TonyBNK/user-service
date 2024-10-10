import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { CreateUserDto } from '../../src/features/users/dto';
import { ErrorResult, Paginator } from '../../src/types';
import { UserViewModel } from '../../src/types/view/user';
import { basicAuth, bearerAuth, createTestApp, getRouterPaths } from '../utils';
import { createValidUsersInput } from '../utils/create-valid-users-input';

describe('Auth e2e', () => {
  const invalidAccessToken = 'invalid_access_token';
  const routerPaths = getRouterPaths('/api/v1');

  let app: INestApplication;
  let server: App;
  let user: UserViewModel | null = null;
  let accessToken: string = '';

  const emptyGetAllResponse: Paginator<UserViewModel> = {
    totalCount: 0,
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    items: [],
  };

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();

    await request(server)
      .delete(`${routerPaths.testing}/all-data`)
      .expect(HttpStatus.NO_CONTENT);
  });

  afterAll(async () => {
    await request(server)
      .delete(`${routerPaths.testing}/all-data`)
      .expect(HttpStatus.NO_CONTENT);

    await app.close();
  });

  describe('- POST Auth Registration', () => {
    beforeEach(async () => {
      await request(server)
        .delete(`${routerPaths.testing}/all-data`)
        .expect(HttpStatus.NO_CONTENT);
    });

    afterAll(async () => {
      await request(server)
        .delete(`${routerPaths.testing}/all-data`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return status 400 with incorrect input data', async () => {
      const inputData: CreateUserDto = {
        login: '',
        password: '',
        email: '',
        age: 0,
        biography: '',
      };

      const errorResult: ErrorResult = {
        errorsMessages: [
          {
            field: 'login',
            message: 'login must be longer than or equal to 3 characters',
          },
          {
            field: 'email',
            message: 'email must be a valid email address',
          },
          {
            field: 'password',
            message: 'password must be longer than or equal to 6 characters',
          },
          {
            field: 'age',
            message: 'age must not be less than 1',
          },
          {
            field: 'biography',
            message: 'biography must contain symbols',
          },
        ],
      };

      await request(server)
        .post(`${routerPaths.auth}/registration`)
        .send(inputData)
        .expect(HttpStatus.BAD_REQUEST, errorResult);

      await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK, emptyGetAllResponse);
    });

    it('should return status 400 if such email or login already exist', async () => {
      const [userDto] = createValidUsersInput(1);

      const errorResult: ErrorResult = {
        errorsMessages: [
          {
            field: 'email',
            message: 'Such email already exists.',
          },
          {
            field: 'login',
            message: 'Such login already exists.',
          },
        ],
      };

      await request(server)
        .post(`${routerPaths.auth}/registration`)
        .send(userDto)
        .expect(HttpStatus.NO_CONTENT);

      await request(server)
        .post(`${routerPaths.auth}/registration`)
        .send(userDto)
        .expect(HttpStatus.BAD_REQUEST, errorResult);
    });
  });

  describe('+ POST Auth Registration', () => {
    afterEach(async () => {
      const response = await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK);

      expect(response.body.totalCount).toEqual(1);
      expect(response.body.items.length).toEqual(1);
    });

    it('should return new user with status 201', async () => {
      const [userDto] = createValidUsersInput(1);

      await request(server)
        .post(`${routerPaths.auth}/registration`)
        .send(userDto)
        .expect(HttpStatus.NO_CONTENT);

      const response = await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK);

      expect(response.body.totalCount).toEqual(1);
      expect(response.body.items.length).toEqual(1);

      user = response.body.items[0];
    });
  });

  describe('- POST Auth Login', () => {
    it('should return status 401 with incorrect input data', async () => {
      const incorrectData = {
        loginOrEmail: user!.login,
        password: '1234',
      };

      await request(server)
        .post(`${routerPaths.auth}/login`)
        .send(incorrectData)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('+ POST Auth Login', () => {
    it('should return valid accessToken with correct input data', async () => {
      const correctData = {
        loginOrEmail: user!.login,
        password: '1234567',
      };

      const response = await request(server)
        .post(`${routerPaths.auth}/login`)
        .send(correctData)
        .expect(HttpStatus.OK);

      expect(response.body.accessToken).toBeDefined();

      accessToken = response.body.accessToken;
    });
  });

  describe('- GET Auth me', () => {
    it('should return status 401 with invalid access token', async () => {
      await request(server)
        .get(`${routerPaths.auth}/me`)
        .set(bearerAuth(invalidAccessToken))
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('+ GET Auth me', () => {
    it('should return status user info with valid access token', async () => {
      const response = await request(server)
        .get(`${routerPaths.auth}/me`)
        .set(bearerAuth(accessToken))
        .expect(HttpStatus.OK);

      expect(response.body.login).toEqual(user!.login);
    });
  });
});
