const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

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
} else {
  console.warn('⚠️  DATABASE_URL not set — running without database. Blog/admin features disabled.');
}

module.exports = pool;
