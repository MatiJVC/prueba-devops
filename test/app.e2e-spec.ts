import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/users (e2e)', () => {
    const testUser = {
      nombre: 'Test User',
      rut: '99999999-9',
      fecha_nacimiento: '01-01-2000',
      ciudad: 'Santiago',
    };

    it('should create, retrieve, and delete a user', async () => {
      // 1. GET initial users list
      const getResponseBefore = await request(app.getHttpServer())
        .get('/users')
        .expect(200);
      const initialLength = getResponseBefore.body.length;

      // 2. POST create user
      await request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(201)
        .expect(testUser);

      // 3. GET verify user exists in the list
      const getResponseAfter = await request(app.getHttpServer())
        .get('/users')
        .expect(200);
      expect(getResponseAfter.body.length).toBe(initialLength + 1);
      expect(
        getResponseAfter.body.find((u: any) => u.rut === testUser.rut),
      ).toBeDefined();

      // 4. DELETE user (using path param)
      await request(app.getHttpServer())
        .delete(`/users/${testUser.rut}`)
        .expect(200);

      // 5. GET verify user is deleted
      const getResponseFinal = await request(app.getHttpServer())
        .get('/users')
        .expect(200);
      expect(getResponseFinal.body.length).toBe(initialLength);
      expect(
        getResponseFinal.body.find((u: any) => u.rut === testUser.rut),
      ).toBeUndefined();
    });

    it('should return 400 when trying to create a user with missing fields', async () => {
      const invalidUser = {
        nombre: 'Invalid User',
        // rut is missing
        fecha_nacimiento: '01-01-2000',
        ciudad: 'Santiago',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidUser)
        .expect(400);
    });

    it('should return 400 when trying to create a user with extra fields (strict whitelist)', async () => {
      const extraFieldUser = {
        ...testUser,
        role: 'admin', // extra property
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(extraFieldUser)
        .expect(400);
    });

    it('should return 404 when trying to delete a non-existent user', async () => {
      await request(app.getHttpServer())
        .delete('/users/non-existent-rut')
        .expect(404);
    });

    it('should return 409 when trying to create a user with duplicate RUT', async () => {
      // 1. POST create user
      await request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(201);

      // 2. POST create duplicate user
      await request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(409);

      // Clean up
      await request(app.getHttpServer())
        .delete(`/users/${testUser.rut}`)
        .expect(200);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
