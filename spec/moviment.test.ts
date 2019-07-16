import { transformLetterIntoNumber, transformNumberIntoLetter } from '../src/shared/moviment';

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
});
