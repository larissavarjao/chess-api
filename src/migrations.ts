export default {
  1: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
  2: `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    )`,
  3: `CREATE TABLE IF NOT EXISTS moves (
        id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP,
        move_to TEXT NOT NULL,
        move_from TEXT NOT NULL
    `,
  4: `CREATE TABLE IF NOT EXISTS users_moves (
        user_id UUID NOT NULL REFERENCES users(id),
        move_id UUID NOT NULL REFERENCES moves(id)
    )`,
};
