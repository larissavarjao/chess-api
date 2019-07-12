import * as express from 'express';
import { sql } from '../postgres';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export interface User {
  id?: string;
  name: string;
  email: string;
}

export const get = async (id: string): Promise<DBUser | undefined> => {
  return (await sql`
    SELECT *
      FROM users
      WHERE id = ${id}
    `)[0];
};

export const getByEmail = async (email: string): Promise<DBUser | undefined> => {
  return (await sql`
    SELECT *
      FROM users
      WHERE email = ${email}
    `)[0];
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

export const generateAuthToken = (id: string, email: string): string => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET || 'thisIsNotTheRealSecretIsOnlyUsedOnDeveloperMode');

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
