export const transformLetterIntoNumber = (letter: string): number => {
  return letter.charCodeAt(0) - 64;
};

export const transformNumberIntoLetter = (letter: number): string => {
  return String.fromCharCode(letter + 64);
};

const horizontalMoves = (line: number, column: number) => {};

export const getPossibleMoviments = (moveFrom: string): string[] => {
  const line = transformLetterIntoNumber(moveFrom[0]);
  const column = parseInt(moveFrom[1]);

  return [];
};
