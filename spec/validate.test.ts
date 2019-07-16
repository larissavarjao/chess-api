import { validateMove } from '../src/shared/validate';
import { invalidMove, invalidMove2, invalidMove3, invalidMove4, invalidMove5 } from './generators/move';

describe('Validate function', () => {
  test('Validate function is with correct params', () => {
    const move = validateMove('A5');

    expect(move).toBe(true);
  });

  test('Validate function is with invalid letter', () => {
    const move = validateMove(invalidMove);

    expect(move).toBe(false);
  });

  test('Validate function is with invalid letter', () => {
    const move = validateMove(invalidMove2);

    expect(move).toBe(false);
  });

  test('Validate function is with invalid letter', () => {
    const move = validateMove(invalidMove3);

    expect(move).toBe(false);
  });

  test('Validate function is with invalid letter', () => {
    const move = validateMove(invalidMove4);

    expect(move).toBe(false);
  });

  test('Validate function is with invalid letter', () => {
    const move = validateMove(invalidMove5);

    expect(move).toBe(false);
  });
});
