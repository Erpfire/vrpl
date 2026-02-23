const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

function getPool() {
  if (pool) return pool;

  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });

    pool.on('connect', () => {
      console.log('✅ PostgreSQL connected successfully');
    });

    pool.on('error', (err) => {
      console.error('⚠️  PostgreSQL pool error (non-fatal):', err.message);
    });
  }

  return pool;
}

// Initialize immediately if DATABASE_URL is already set
getPool();

module.exports = { getPool };
