const isValidPosition = (column: number) => column <= 8 && column >= 1;

export const transformLetterIntoNumber = (letter: string): number => {
  return letter.charCodeAt(0) - 64;
};

export const transformNumberIntoLetter = (letter: number): string => {
  return String.fromCharCode(letter + 64);
};

export const horizontalMoves = (line: number, column: number): string[] => {
  const moves: string[] = [];
  // right move up
  line = line + 2;
  column = column + 1;
  if (isValidPosition(column) && isValidPosition(line)) {
    moves.push(`${transformNumberIntoLetter(line)}${column}`);
  }
  line = line - 2;
  column = column - 1;

  // right move down
  line = line + 2;
  column = column - 1;
  if (isValidPosition(column) && isValidPosition(line)) {
    moves.push(`${transformNumberIntoLetter(line)}${column}`);
  }
  line = line - 2;
  column = column + 1;

  // left move up
  line = line - 2;
  column = column + 1;
  if (isValidPosition(column) && isValidPosition(line)) {
    moves.push(`${transformNumberIntoLetter(line)}${column}`);
  }
  line = line + 2;
  column = column - 1;

  // left move down
  line = line - 2;
  column = column - 1;
  if (isValidPosition(column) && isValidPosition(line)) {
    moves.push(`${transformNumberIntoLetter(line)}${column}`);
  }

  return moves;
};

export const verticalMoves = (line: number, column: number): string[] => {
  const moves: string[] = [];

  // up right move
  line = line + 1;
  column = column + 2;
  if (isValidPosition(column) && isValidPosition(line)) {
    moves.push(`${transformNumberIntoLetter(line)}${column}`);
  }
  line = line - 1;
  column = column - 2;

  // down right move
  line = line - 1;
  column = column + 2;
  if (isValidPosition(column) && isValidPosition(line)) {
    moves.push(`${transformNumberIntoLetter(line)}${column}`);
  }
  line = line + 1;
  column = column - 2;

  // up left move
  line = line - 1;
  column = column - 2;
  if (isValidPosition(column) && isValidPosition(line)) {
    moves.push(`${transformNumberIntoLetter(line)}${column}`);
  }
  line = line + 1;
  column = column + 2;

  // down left move
  line = line + 1;
  column = column - 2;
  if (isValidPosition(column) && isValidPosition(line)) {
    moves.push(`${transformNumberIntoLetter(line)}${column}`);
  }

  return moves;
};

export const getPossibleMoviments = (moveFrom: string): string[] => {
  const moves: string[] = [];
  const line = transformLetterIntoNumber(moveFrom[0]);
  const column = parseInt(moveFrom[1]);

  horizontalMoves(line, column).map(move => moves.push(move));
  verticalMoves(line, column).map(move => moves.push(move));

  return moves;
};
