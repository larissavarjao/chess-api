import * as pg from 'pg';
require('pg/lib/defaults').parseInputDatesAsUTC = true;

const pgCamelCase = require('pg-camelcase');
pgCamelCase.inject(pg);

const pgpool = new pg.Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'postgres',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  password: process.env.NODE_ENV ? process.env.POSTGRES_PASS : 'postgres',
  max: 300,
});

export default pgpool;

export function runMigrations() {
  return migrate({
    ...require('./migrations').default,
  });
}

if (!process.env.TEST) {
  runMigrations();
}

const log = process.env.TEST ? (...x: any[]) => {} : console.log;

export enum SqlOperator {
  in = 'in',
  isNull = 'isNull',
}

function wrapSql(callable: { query: (query: string, values: any[]) => Promise<pg.QueryResult> }) {
  return (q: TemplateStringsArray, ...values: any[]) => {
    const query: string[] = [];
    query.push(q[0]);

    for (let i = 0; i < values.length; ++i) {
      query.push('$' + (i + 1));
      query.push(q[i + 1]);
    }

    return callable
      .query(query.join(''), values)
      .then(result => result.rows)
      .catch(e => {
        log({
          query: query.join(''),
          values,
          error: e,
        });
        throw e;
      });
  };
}

export enum SqlLogicOperator {
  eq = '=',
  like = '~~*',
  gt = '>',
  ge = '>=',
  lt = '<',
  le = '<=',
  ne = '<>',
}

export const sql = wrapSql(pgpool);

export async function sqlTransaction(
  func: (sql: (q: TemplateStringsArray, ...values: any[]) => Promise<any[]>) => Promise<void>
) {
  while (true) {
    const client = await pgpool.connect();
    try {
      await client.query('BEGIN');
      await func((q, ...values) => {
        const query: string[] = [];
        query.push(q[0]);

        for (let i = 0; i < values.length; ++i) {
          query.push('$' + (i + 1));
          query.push(q[i + 1]);
        }

        return client
          .query(query.join(''), values)
          .then((result: any) => result.rows)
          .catch(e => {
            log(query, values);
            throw e;
          });
      });

      await client.query('COMMIT');
      break;
    } catch (e) {
      await client.query('ROLLBACK');

      // could not serialize access due to concurrent update
      if (e.code !== '40001') throw e;
    } finally {
      client.release();
    }
  }
}

interface Migrations {
  [n: number]: string | ((sql: (q: TemplateStringsArray, ...values: any[]) => Promise<any[]>) => Promise<void>);
}

async function migrate(migrations: Migrations): Promise<void> {
  try {
    await internalMigrate(migrations);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function internalMigrate(migrations: Migrations): Promise<void> {
  const client = await pgpool.connect();

  try {
    const sql = wrapSql(client);

    await sql`
            CREATE TABLE IF NOT EXISTS "migrations" (
                "id" INTEGER NOT NULL PRIMARY KEY,
                "created_at" TIMESTAMP NOT NULL,
                "duration" INTERVAL,
                "query" TEXT NOT NULL
            )
        `;

    // Order and verify migration
    const migrationIds = Object.keys(migrations)
      .map(n => parseInt(n))
      .sort((a, b) => a - b);
    migrationIds.forEach((el, i) => {
      if (el !== i + 1) {
        throw new Error('Specified migrations are not sequential');
      }
    });

    log('Obtaining migration lock');
    //await sql`SELECT pg_advisory_lock(1)`;
    log('Got migration lock');

    const insertedMigrations = await sql`SELECT * FROM "migrations" ORDER BY "id"`;

    for (let i = 0; i < insertedMigrations.length; ++i) {
      const insertedMigration = insertedMigrations[i];

      if (insertedMigration.id !== i + 1) {
        log(insertedMigrations);
        log(`Migration order -> ${insertedMigrations.map(u => u.id).join(',')}`);

        throw {
          type: 'Fatal',
          message: `Inserted migrations are not sequential (${i} -> ${insertedMigration.id})`,
        };
      }

      if (!migrationIds.includes(insertedMigration.id)) {
        throw {
          type: 'Fatal',
          message: `Migration ${insertedMigration.id} exists on database, but was not specified.`,
        };
      }
    }

    let lastExecutedMigrationId =
      insertedMigrations.length === 0 ? -1 : insertedMigrations[insertedMigrations.length - 1].id;

    for (const migrationId of migrationIds) {
      if (migrationId < 1 || (lastExecutedMigrationId !== -1 && migrationId !== lastExecutedMigrationId + 1)) {
        continue;
      }

      await sleep(Math.random() * 1000);

      const migrationQuery = migrations[migrationId];
      const createdAt = new Date();
      const startTime = process.hrtime();

      if (typeof migrationQuery === 'string' && migrationQuery.includes('-- no transaction')) {
        try {
          log(`Running migration ${migrationId} WITHOUT TRANSACTION...`);

          for (const query of migrationQuery.split(';')) {
            if (query.trim()) await client.query(query);
          }

          const deltaTime = process.hrtime(startTime);
          const duration = deltaTime[0] + deltaTime[1] * 1e-9;
          await sql`
                        INSERT INTO "migrations" (
                            "id",
                            "created_at",
                            "query",
                            "duration"
                        ) VALUES (
                            ${migrationId},
                            ${createdAt},
                            ${migrationQuery.toString()},
                            ${duration}
                        )
                    `;
        } catch (e) {
          await sql`ROLLBACK`;
          log('Migration failure');
          log(migrationQuery.toString());
          throw e;
        }
      } else {
        log(`Running migration ${migrationId}...`);
        await sql`BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE`;

        try {
          if (typeof migrationQuery === 'string') {
            await client.query(migrationQuery);
          } else {
            await migrationQuery(sql);
          }
          const deltaTime = process.hrtime(startTime);
          const duration = deltaTime[0] + deltaTime[1] * 1e-9;

          await sql`
                        INSERT INTO "migrations" (
                            "id",
                            "created_at",
                            "query",
                            "duration"
                        ) VALUES (
                            ${migrationId},
                            ${createdAt},
                            ${migrationQuery.toString()},
                            ${duration}
                        )
                    `;
          await sql`COMMIT`;
        } catch (e) {
          await sql`ROLLBACK`;
          log('Migration failure');
          log(migrationQuery.toString());
          throw e;
        }
      }

      lastExecutedMigrationId = migrationId;
    }
  } finally {
    log('Releasing migration lock');
    await sql`SELECT pg_advisory_unlock(1)`;
    log('Migrations ready');
    client.release();
  }
}
