import { sql } from '../postgres';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { DBUser } from '../db';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
}

export const JWT_SECRET = process.env.JWT_SECRET || 'thisIsNotTheRealSecretIsOnlyUsedOnDeveloperMode';

export const get = async (id: string): Promise<DBUser | undefined> => {
  return (await sql`
    SELECT *
      FROM users
      WHERE id = ${id} AND deleted_at IS NULL ;`)[0];
};

export const getByEmail = async (email: string): Promise<DBUser | undefined> => {
  return (await sql`
    SELECT *
      FROM users
      WHERE email = ${email} AND deleted_at IS NULL ;`)[0];
};

export const insert = async (name: string, email: string, password: string): Promise<DBUser> => {
  return (await sql`
    INSERT INTO users (
        created_at,
        updated_at,
        deleted_at,
        name,
        email,
        password
    ) values (
        NOW(),
        NOW(),
        NULL,
        ${name},
        ${email},
        ${await bcrypt.hash(password, await bcrypt.genSalt())}
    ) RETURNING *`)[0];
};

export const update = async (name: string, id: string, email: string): Promise<DBUser> => {
  return (await sql`
    UPDATE users 
      SET name = ${name},
          email = ${email},
          updated_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL 
      RETURNING *`)[0];
};

export const remove = async (id: string): Promise<DBUser> => {
  return (await sql`
    UPDATE users 
      SET deleted_at = NOW()
      WHERE id = ${id} RETURNING * ;`)[0];
};

export const generateAuthToken = (id: string): string => {
  const token = jwt.sign({ id }, JWT_SECRET);

  return token;
};

export const format = (user: DBUser): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const comparePassword = async (password: string, userPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, userPassword);
};
