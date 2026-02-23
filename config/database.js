const { Pool } = require('pg');
require('dotenv').config();

// This module is loaded after start-safe.js may have set DATABASE_URL dynamically
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

// Export a proxy that lazily initializes the pool
// This way it picks up DATABASE_URL even if set after this module is first required
module.exports = new Proxy({}, {
  get(_, prop) {
    const p = getPool();
    if (!p) return undefined;
    const val = p[prop];
    return typeof val === 'function' ? val.bind(p) : val;
  }
});

module.exports.getPool = getPool;
