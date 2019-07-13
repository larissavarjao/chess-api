import { sql } from '../../src/postgres';

const deleteAllUsers = async () => {
  await sql`DELETE FROM users`;
};

export const setupDB = async () => {
  await deleteAllUsers();
};
