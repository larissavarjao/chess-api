import 'jest-extended';
import {
  transformLetterIntoNumber,
  transformNumberIntoLetter,
  horizontalMoves,
  verticalMoves,
  getPossibleMoviments,
} from '../src/shared/moviment';
import { expectedForC3, expectedForA1, expectedForG8 } from './generators/move';

describe('Moviment logic', () => {
  test('transform letter into a number', () => {
    const number = transformLetterIntoNumber('A');

    expect(number).toBe(1);
  });

  test('transform number into a letter', () => {
    const letter = transformNumberIntoLetter(1);

    expect(letter).toBe('A');
  });

  test('transform letter into a number', () => {
    const number = transformLetterIntoNumber('H');

    expect(number).toBe(8);
  });

  test('transform number into a letter', () => {
    const letter = transformNumberIntoLetter(8);

    expect(letter).toBe('H');
  });

  test('Horizontal moves return properly results for C3', () => {
    const horizontal = horizontalMoves(3, 3);
    const horizontalExpectedResults = ['E2', 'E4', 'A2', 'A4'];

    expect(horizontal).toBeArray();
    expect(horizontal).toHaveLength(4);
    expect(horizontal).toIncludeAllMembers(horizontalExpectedResults);
  });

  test('Horizontal moves return properly results A1', () => {
    const horizontal = horizontalMoves(1, 1);
    const horizontalExpectedResults = ['C2'];

    expect(horizontal).toBeArray();
    expect(horizontal).toHaveLength(1);
    expect(horizontal).toIncludeAllMembers(horizontalExpectedResults);
  });

  test('Horizontal moves return properly results G8', () => {
    const horizontal = horizontalMoves(7, 8);
    const horizontalExpectedResults = ['E7'];

    expect(horizontal).toBeArray();
    expect(horizontal).toHaveLength(1);
    expect(horizontal).toIncludeAllMembers(horizontalExpectedResults);
  });

  test('Vertical moves return properly results for C3', () => {
    const vertical = verticalMoves(3, 3);
    const verticalExpectedResults = ['D5', 'D1', 'B5', 'B1'];

    expect(vertical).toBeArray();
    expect(vertical).toHaveLength(4);
    expect(vertical).toIncludeAllMembers(verticalExpectedResults);
  });

  test('Vertical moves return properly results A1', () => {
    const vertical = verticalMoves(1, 1);
    const verticalExpectedResults = ['B3'];

    expect(vertical).toBeArray();
    expect(vertical).toHaveLength(1);
    expect(vertical).toIncludeAllMembers(verticalExpectedResults);
  });

  test('Vertical moves return properly results G8', () => {
    const vertical = verticalMoves(7, 8);
    const verticalExpectedResults = ['H6', 'F6'];

    expect(vertical).toBeArray();
    expect(vertical).toHaveLength(2);
    expect(vertical).toIncludeAllMembers(verticalExpectedResults);
  });

  test('Get all moves return properly results for C3', () => {
    const moves = getPossibleMoviments('C3');

    expect(moves).toBeArray();
    expect(moves).toHaveLength(8);
    expect(moves).toIncludeAllMembers(expectedForC3);
  });

  test('Get all moves return properly results A1', () => {
    const moves = getPossibleMoviments('A1');

    expect(moves).toBeArray();
    expect(moves).toHaveLength(2);
    expect(moves).toIncludeAllMembers(expectedForA1);
  });

  test('Get all moves return properly results G8', () => {
    const moves = getPossibleMoviments('G8');

    expect(moves).toBeArray();
    expect(moves).toHaveLength(3);
    expect(moves).toIncludeAllMembers(expectedForG8);
  });
});
