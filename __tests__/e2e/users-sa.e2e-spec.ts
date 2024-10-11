import { HttpStatus, INestApplication } from '@nestjs/common';
import { afterEach } from 'node:test';
import request from 'supertest';
import { App } from 'supertest/types';
import { v4 } from 'uuid';
import { ErrorResult, Paginator } from '../../src/common/types';
import { UserViewModel } from '../../src/common/types/view/user';
import { CreateUserDto, UpdateUserDto } from '../../src/features/users/dto';
import { basicAuth, createTestApp, getRouterPaths } from '../utils';
import { createValidUsersInput } from '../utils/create-valid-users-input';

describe('Users SA e2e', () => {
  const routerPaths = getRouterPaths('/api/v1');

  let app: INestApplication;
  let server: App;
  let user: UserViewModel | null = null;

  const fakeId = v4();
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

  describe('- GET Users SA', () => {
    it('should return status 401 without authorization', async () => {
      await request(server)
        .get(routerPaths.users_sa)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('+ GET Users SA', () => {
    it('should return empty users with status 200', async () => {
      await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK, emptyGetAllResponse);
    });
  });

  describe('- POST Users SA', () => {
    afterEach(async () => {
      await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK, emptyGetAllResponse);
    });

    it('should return status 401 without authorization', async () => {
      await request(server)
        .post(routerPaths.users_sa)
        .expect(HttpStatus.UNAUTHORIZED);
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
          { field: 'email', message: 'email must be a valid email address' },
          {
            field: 'password',
            message: 'password must be longer than or equal to 6 characters',
          },
          { field: 'age', message: 'age must not be less than 1' },
          { field: 'biography', message: 'biography must contain symbols' },
        ],
      };

      await request(server)
        .post(routerPaths.users_sa)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.BAD_REQUEST, errorResult);
    });
  });

  describe('+ POST Users SA', () => {
    beforeEach(async () => {
      await request(server)
        .delete(`${routerPaths.testing}/all-data`)
        .expect(HttpStatus.NO_CONTENT);
    });

    afterEach(async () => {
      const response = await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK);

      expect(response.body.totalCount).toEqual(1);
      expect(response.body.items.length).toEqual(1);
    });

    it('should return new user with status 201', async () => {
      const [inputData] = createValidUsersInput(1);

      const response = await request(server)
        .post(routerPaths.users_sa)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.CREATED);

      user = response.body;

      const expectedResponse: Paginator<UserViewModel> = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [user!],
      };

      await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK, expectedResponse);
    });
  });

  describe('- PUT Users SA', () => {
    afterEach(async () => {
      const expectedResponse: Paginator<UserViewModel> = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [user!],
      };

      await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK, expectedResponse);
    });

    it('should return status 401 without authorization', async () => {
      await request(server)
        .put(`${routerPaths.users_sa}/${user?.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 404 if such user does not exist', async () => {
      await request(server)
        .put(`${routerPaths.users_sa}/${fakeId}`)
        .set(basicAuth)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return status 400 with incorrect input data', async () => {
      const inputData: UpdateUserDto = {
        password: '',
        age: 0,
        biography: '',
      };

      const errorResult: ErrorResult = {
        errorsMessages: [
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
        .put(`${routerPaths.users_sa}/${user?.id}`)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.BAD_REQUEST, errorResult);
    });
  });

  describe('+ PUT Users SA', () => {
    it('should update user with status 204', async () => {
      const inputData: UpdateUserDto = {
        password: '12345678',
        age: 18,
        biography: '123456',
      };

      await request(server)
        .put(`${routerPaths.users_sa}/${user?.id}`)
        .set(basicAuth)
        .send(inputData)
        .expect(HttpStatus.NO_CONTENT);

      const response = await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK);

      const updatedUser = response.body.items[0];

      expect(updatedUser.age).toEqual(inputData.age);
      expect(updatedUser.biography).toEqual(inputData.biography);

      user = updatedUser;
    });
  });

  describe('- DELETE Users SA', () => {
    afterEach(async () => {
      const expectedResponse: Paginator<UserViewModel> = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [user!],
      };

      await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK, expectedResponse);
    });

    it('should return status 401 without authorization', async () => {
      await request(server)
        .delete(`${routerPaths.users_sa}/${user!.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('+ DELETE Users SA', () => {
    afterEach(async () => {
      await request(server)
        .get(routerPaths.users_sa)
        .set(basicAuth)
        .expect(HttpStatus.OK, emptyGetAllResponse);
    });

    it('should delete user', async () => {
      await request(server)
        .delete(`${routerPaths.users_sa}/${user?.id}`)
        .set(basicAuth)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});
