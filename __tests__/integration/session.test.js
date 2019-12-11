import request from 'supertest';
import faker from 'faker';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Should be able to login with valid credentials', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('Should not be able to to login with invalid email', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('Should not be able to to login with invalid password', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: faker.internet.password(),
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
