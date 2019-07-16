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
