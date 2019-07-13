import * as faker from 'faker';
import { NewUser } from '../../src/user/model';

export const generateUser = (): NewUser => {
  return {
    email: faker.internet.email(),
    name: faker.name.firstName(),
    password: faker.internet.password(),
  };
};
