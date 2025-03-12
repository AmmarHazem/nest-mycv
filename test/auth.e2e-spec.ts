import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';

describe('Authentication', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('handles sign up request', async () => {
    const email = 'asjdfhkjsd@email.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: '123456' });
    expect(res.status).toEqual(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.email).toEqual(email);
  });
});
