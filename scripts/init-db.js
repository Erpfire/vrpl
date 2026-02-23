/**
 * Auto-creates the vrpl_db database if it doesn't exist.
 * Connects to the default 'postgres' database first, creates vrpl_db,
 * then sets DATABASE_URL for the rest of the app.
 *
 * Env vars needed: POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD
 * Optional: POSTGRES_PORT (default 5432), POSTGRES_DB (default vrpl_db)
 */
const { Client } = require('pg');

const DB_NAME = process.env.POSTGRES_DB || 'vrpl_db';
const PG_HOST = process.env.POSTGRES_HOST;
const PG_USER = process.env.POSTGRES_USER || 'postgres';
const PG_PASS = process.env.POSTGRES_PASSWORD;
const PG_PORT = process.env.POSTGRES_PORT || 5432;

async function ensureDatabase() {
  if (!PG_HOST || !PG_PASS) {
    console.log('ℹ️  POSTGRES_HOST/POSTGRES_PASSWORD not set — skipping database auto-creation.');
    return false;
  }

  // Connect to default 'postgres' database to create our app database
  const client = new Client({
    host: PG_HOST,
    port: PG_PORT,
    user: PG_USER,
    password: PG_PASS,
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log('🔗 Connected to PostgreSQL server.');

    // Check if database exists
    const res = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [DB_NAME]
    );

    if (res.rowCount === 0) {
      // Database doesn't exist — create it
      // (identifiers can't be parameterized, but DB_NAME is from env/hardcoded)
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`✅ Database "${DB_NAME}" created successfully.`);
    } else {
      console.log(`✅ Database "${DB_NAME}" already exists.`);
    }

    // Set DATABASE_URL for the rest of the application
    const encodedPass = encodeURIComponent(PG_PASS);
    process.env.DATABASE_URL = `postgresql://${PG_USER}:${encodedPass}@${PG_HOST}:${PG_PORT}/${DB_NAME}`;
    console.log(`✅ DATABASE_URL configured automatically.`);

    return true;
  } catch (err) {
    console.error('⚠️  Database auto-creation failed:', err.message);
    return false;
  } finally {
    await client.end();
  }
}

module.exports = ensureDatabase;
