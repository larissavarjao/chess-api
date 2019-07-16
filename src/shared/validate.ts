export const validateMove = (move: string): boolean => {
  const firstLetter = move[0];
  const secondLetter = move[1];
  const lowerThenLetterA = firstLetter.charCodeAt(0) < 65;
  const biggerThenLetterH = firstLetter.charCodeAt(0) > 72;
  const lowerThenNumber1 = parseInt(secondLetter) < 1;
  const biggerThenNumber8 = parseInt(secondLetter) > 8;

  if (move.length !== 2 || lowerThenLetterA || biggerThenLetterH || lowerThenNumber1 || biggerThenNumber8) {
    return false;
  }

  return true;
};
