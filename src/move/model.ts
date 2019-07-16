import { sql, sqlTransaction } from '../postgres';
import { DBMove } from '../db';
import { getPossibleMoviments } from '../shared/moviment';

export interface Move {
  id: string;
  moveTo: string;
  moveFrom: string;
}

export const get = async (id: string): Promise<DBMove | undefined> => {
  return (await sql`
    SELECT *
      FROM moves
      WHERE id = ${id} AND deleted_at IS NULL ;`)[0];
};

export const getAllMovesFromUser = async (userId: string): Promise<DBMove[] | undefined> => {
  return await sql`
    SELECT id, created_at, updated_at, deleted_at, move_from, move_to
      FROM users_moves um
      LEFT JOIN moves ON um.move_id = id
      WHERE user_id = ${userId} AND deleted_at IS NULL ;`;
};

export const getPossibilities = (moveFrom: string): string[] => {
  return getPossibleMoviments(moveFrom);
};

export const insert = async (userId: string, moveFrom: string, moveTo: string): Promise<DBMove> => {
  let move: DBMove;
  try {
    await sqlTransaction(async sql => {
      move = (await sql` INSERT INTO moves (
            created_at,
            updated_at,
            deleted_at,
            move_from,
            move_to
        ) values (
            NOW(),
            NOW(),
            NULL,
            ${moveFrom},
            ${moveTo}
        ) RETURNING * ;`)[0];
      await sql`INSERT INTO users_moves (
            user_id,
            move_id
        ) values (
            ${userId},
            ${move.id}
        ) RETURNING * ;`;
    });
    return move!;
  } catch (e) {
    return e;
  }
};

export const remove = async (id: string): Promise<DBMove> => {
  return (await sql`
    UPDATE moves 
      SET deleted_at = NOW()
      WHERE id = ${id} RETURNING * ;`)[0];
};

export const format = (move: DBMove): Move => {
  return {
    id: move.id,
    moveFrom: move.moveFrom,
    moveTo: move.moveTo,
  };
};
