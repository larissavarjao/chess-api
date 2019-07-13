import * as request from 'supertest';
import { app } from '../src/index';
import * as User from '../src/user/model';
import { setupDB } from './fixtures/db';
import { generateUser } from './generators/user';

describe('User test', () => {
  let newUser: User.NewUser;

  beforeAll(() => {
    setupDB();
  });

  beforeEach(() => {
    newUser = generateUser();
  });

  test('User should not create user when missing email', async () => {
    delete newUser.email;
    const response = await request(app)
      .post('/users')
      .send(newUser);

    expect(response.status).toBe(401);
  });

  test('User should not create user when missing password', async () => {
    delete newUser.password;
    const response = await request(app)
      .post('/users')
      .send(newUser);

    expect(response.status).toBe(401);
  });

  test('User should not create user when missing name', async () => {
    delete newUser.name;
    const response = await request(app)
      .post('/users')
      .send(newUser);

    expect(response.status).toBe(401);
  });

  test('User should create user with correct arguments', async () => {
    const response = await request(app)
      .post('/users')
      .send(newUser);
    expect(response.status).toBe(200);
  });
});
