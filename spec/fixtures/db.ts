import { sql } from '../../src/postgres';

const deleteAllUsers = async () => {
  await sql`DELETE FROM users`;
};

const deleteAllMoves = async () => {
  await sql`DELETE FROM moves`;
};

const deleteAllUsersMoves = async () => {
  await sql`DELETE FROM users_moves`;
};

export const setupDB = async () => {
  await deleteAllUsersMoves();
  await deleteAllMoves();
  await deleteAllUsers();
};
