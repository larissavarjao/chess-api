import * as faker from 'faker';
import { Move } from '../../src/move/model';
import { generateMoviment } from '../utils/move';

export const generateMove = (): Move => {
  return {
    id: faker.random.uuid(),
    moveFrom: generateMoviment(),
    moveTo: generateMoviment(),
  };
};

export const invalidMove = 'A9';
export const invalidMove2 = 'A0';
export const invalidMove3 = '@8';
export const invalidMove4 = 'I8';
export const invalidMove5 = '8I';
