import 'jest-extended';
import * as Move from '../src/move/model';
import { setupDB } from './fixtures/db';
import { generateUser } from './generators/user';
import { getMoves, generateMoviment, createMove } from './utils/move';
import { createUser, loginUser } from './utils/user';
import { generateMove } from './generators/move';
import { validateMove } from '../src/shared/validate';
import { User } from '../src/user/model';

describe('User test', () => {
  let user: User;
  let userDBToken: string;
  let moviment: Move.Move;

  beforeAll(async () => {
    await setupDB();
    const userGenerated = generateUser();
    await createUser(userGenerated);
    const loginResult = await loginUser(userGenerated.email, userGenerated.password);
    userDBToken = loginResult.body.token;
    user = loginResult.body.user;

    moviment = await generateMove();
  });

  test('Generator of moviments are correct', async () => {
    const move = generateMoviment();
    const letter = move[0];
    const number = move[1];

    expect(letter).toBeString();
    expect(letter.charCodeAt(0)).toBeWithin(65, 73);
    expect(parseInt(number)).toBeNumber();
    expect(number).toBeWithin(1, 8);
  });

  test('User should not create a moviment without moveFrom', async () => {
    const response = await createMove('', moviment.moveTo, userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not create a moviment without moveTo', async () => {
    const response = await createMove(moviment.moveFrom, '', userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not create a moviment without moveTo', async () => {
    const response = await createMove(moviment.moveFrom, moviment.moveTo, 'invalidToken');

    expect(response.status).toBe(401);
  });

  test('Validate function is with correct params', async () => {
    const move = validateMove('A5');

    expect(move).toBe(true);
  });

  test('Validate function is with invalid letter', async () => {
    const move = validateMove('0A');

    expect(move).toBe(false);
  });

  test('Validate function is with invalid letter', async () => {
    const move = validateMove('A9');

    expect(move).toBe(false);
  });

  test('Validate function is with invalid letter', async () => {
    const move = validateMove('A0');

    expect(move).toBe(false);
  });

  test('Validate function is with invalid letter', async () => {
    const move = validateMove('I8');

    expect(move).toBe(false);
  });

  test('Validate function is with invalid letter', async () => {
    const move = validateMove('@8');

    expect(move).toBe(false);
  });

  test('User should not get his moves with invalid token', async () => {
    const response = await getMoves('invalidToken');

    expect(response.status).toBe(401);
  });

  test('User should create a moviment with correct arguments', async () => {
    const response = await createMove(moviment.moveFrom, moviment.moveTo, userDBToken);
    const moves = await Move.getAllMovesFromUser(user.id);

    expect(response.status).toBe(200);
    expect(moves).not.toBeUndefined();
    expect(moves!.length).toBe(1);
    expect(moves![0].moveFrom).toBe(moviment.moveFrom);
    expect(moves![0].moveTo).toBe(moviment.moveTo);
  });
});
