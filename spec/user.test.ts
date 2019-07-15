import * as faker from 'faker';
import * as User from '../src/user/model';
import { setupDB } from './fixtures/db';
import { generateUser } from './generators/user';
import { createUser, loginUser, updateUser, deleteUser } from './utils/user';
import { DBUser } from '../src/db';

describe('User test', () => {
  let newUser: User.NewUser;
  let secondUser: User.NewUser;
  let secondDB: DBUser;
  let secondDBToken: string;

  beforeAll(() => {
    setupDB();
  });

  beforeEach(async () => {
    newUser = generateUser();
    secondUser = generateUser();
    await createUser(secondUser);
    secondDB = (await loginUser(secondUser.email, secondUser.password)).body.user;
    secondDBToken = (await loginUser(secondUser.email, secondUser.password)).body.token;
  });

  test('User should not create user when missing email', async () => {
    delete newUser.email;
    const response = await createUser(newUser);

    expect(response.status).toBe(401);
  });

  test('User should not create user when missing password', async () => {
    delete newUser.password;
    const response = await createUser(newUser);

    expect(response.status).toBe(401);
  });

  test('User should not create user when missing name', async () => {
    delete newUser.name;
    const response = await createUser(newUser);

    expect(response.status).toBe(401);
  });

  test('User should create user with correct arguments', async () => {
    const response = await createUser(newUser);

    const user = await User.getByEmail(newUser.email);
    const userFromResponse = response.body;

    expect(response.status).toBe(200);
    expect(user).not.toBeUndefined();
    expect(userFromResponse.email).toBe(user!.email);
    expect(userFromResponse.name).toBe(user!.name);
    expect(userFromResponse.id).toBe(user!.id);
    expect(userFromResponse.password).toBeUndefined();
    expect(userFromResponse.createdAt).toBeUndefined();
    expect(userFromResponse.updatedAt).toBeUndefined();
    expect(userFromResponse.deletedAt).toBeUndefined();
  });

  test('User should not login with invalid email', async () => {
    await createUser(newUser);
    const response = await loginUser('', newUser.password);
    expect(response.status).toBe(401);
  });

  test('User should not login with invalid password', async () => {
    await createUser(newUser);
    const response = await loginUser(newUser.email, '1234567');
    expect(response.status).toBe(401);
  });

  test('User should not login with invalid email', async () => {
    await createUser(newUser);
    const response = await loginUser(newUser.email, newUser.password);
    expect(response.status).toBe(200);
  });

  test('User should not update with invalid token', async () => {
    const response = await updateUser(secondUser.name, secondUser.email, 'invalidToken');
    expect(response.status).toBe(401);
  });

  test('User should not update with invalid email', async () => {
    const response = await updateUser(secondUser.name, 'invalidemail', secondDBToken);
    expect(response.status).toBe(401);
  });

  test('User should update with correct arguments', async () => {
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const response = await updateUser(name, email, secondDBToken);
    expect(response.status).toBe(200);

    const user = await User.get(secondDB.id);
    expect(user).not.toBeUndefined();
    expect(user!.id).toBe(secondDB.id);
    expect(user!.email).toBe(email);
    expect(user!.name).toBe(name);
  });

  test('User should not delete with invalid token', async () => {
    const response = await deleteUser('invalidToken');
    expect(response.status).toBe(401);
  });

  test('User should delete with correct arguments', async () => {
    const response = await deleteUser(secondDBToken);
    expect(response.status).toBe(200);

    const user = await User.get(secondDB.id);
    expect(user).toBeUndefined();
    const userFromEmail = await User.getByEmail(secondDB.email);
    expect(userFromEmail).toBeUndefined();
  });
});
