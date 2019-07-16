import 'jest-extended';
import * as Move from '../src/move/model';
import { setupDB } from './fixtures/db';
import { generateUser } from './generators/user';
import { getMoves, generateMoviment, createMove } from './utils/move';
import { createUser, loginUser } from './utils/user';
import {
  generateMove,
  invalidMove,
  invalidMove2,
  invalidMove3,
  invalidMove4,
  invalidMove5,
  expectedForC3,
  expectedForA1,
  expectedForG8,
} from './generators/move';
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
    expect(number).toBeWithin(1, 9);
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

  test('User should not insert with invalid move', async () => {
    const response = await createMove(invalidMove, moviment.moveTo, userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not insert with invalid move', async () => {
    const response = await createMove(invalidMove2, moviment.moveTo, userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not insert with invalid move', async () => {
    const response = await createMove(invalidMove3, moviment.moveTo, userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not insert with invalid move', async () => {
    const response = await createMove(invalidMove4, moviment.moveTo, userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not insert with invalid move', async () => {
    const response = await createMove(invalidMove5, moviment.moveTo, userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not insert with invalid move', async () => {
    const response = await createMove(moviment.moveFrom, invalidMove, userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not insert with invalid move', async () => {
    const response = await createMove(moviment.moveFrom, invalidMove2, userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not insert with invalid move', async () => {
    const response = await createMove(moviment.moveFrom, invalidMove3, userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not insert with invalid move', async () => {
    const response = await createMove(moviment.moveFrom, invalidMove4, userDBToken);

    expect(response.status).toBe(401);
  });

  test('User should not insert with invalid move', async () => {
    const response = await createMove(moviment.moveFrom, invalidMove5, userDBToken);

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

  test('User should not get his moves with invalid token', async () => {
    const response = await getMoves('invalidToken');

    expect(response.status).toBe(401);
  });

  test('User should receive correct moves with querystring', async () => {
    const response = await getMoves(userDBToken, 'C3');
    const responseMoveFrom = response.body.moves;

    expect(response.status).toBe(200);
    expect(responseMoveFrom).not.toBeNull();
    expect(responseMoveFrom).toBeArray();
    expect(responseMoveFrom).toHaveLength(8);
    expect(responseMoveFrom).toIncludeAllMembers(expectedForC3);
  });

  test('User should receive correct moves with querystring', async () => {
    const response = await getMoves(userDBToken, 'A1');
    const responseMoveFrom = response.body.moves;

    expect(response.status).toBe(200);
    expect(responseMoveFrom).not.toBeNull();
    expect(responseMoveFrom).toBeArray();
    expect(responseMoveFrom).toHaveLength(2);
    expect(responseMoveFrom).toIncludeAllMembers(expectedForA1);
  });

  test('User should receive correct moves with querystring', async () => {
    const response = await getMoves(userDBToken, 'G8');
    const responseMoveFrom = response.body.moves;

    expect(response.status).toBe(200);
    expect(responseMoveFrom).not.toBeNull();
    expect(responseMoveFrom).toBeArray();
    expect(responseMoveFrom).toHaveLength(3);
    expect(responseMoveFrom).toIncludeAllMembers(expectedForG8);
  });
});
