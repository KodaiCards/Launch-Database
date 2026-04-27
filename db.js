const { Pool, types } = require('pg');
const fs = require('fs');
const path = require('path');

// Make the postgres DATE type come back as 'YYYY-MM-DD' strings.
// pg's default behavior is to coerce DATE to a JS Date object, which
// breaks any frontend code that does `entry_date + 'T00:00:00'` →
// the result is "Mon Jan 02 2026 ...T00:00:00" which the Date constructor
// cannot parse, and toLocaleDateString() shows "Invalid Date".
// 1082 is the oid for the DATE type. (TIMESTAMPTZ stays a Date object.)
types.setTypeParser(1082, (val) => val);

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL environment variable is not set.');
  console.error('In Railway: make sure your PostgreSQL service is linked to this service.');
  console.error('Check Variables tab — DATABASE_URL should be auto-injected.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initSchema() {
  // First test the connection
  try {
    const testResult = await pool.query('SELECT NOW()');
    console.log('✓ Database connected at', testResult.rows[0].now);
  } catch (err) {
    console.error('DATABASE CONNECTION FAILED:');
    console.error('  Error:', err.message || JSON.stringify(err));
    console.error('  Code:', err.code);
    console.error('  DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.error('  DATABASE_URL starts with:', (process.env.DATABASE_URL || '').substring(0, 30) + '...');
    return;
  }

  // Then run schema
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(schema);
    console.log('✓ Database schema ready');
  } catch (err) {
    console.error('SCHEMA INIT FAILED:');
    console.error('  Message:', err.message || 'no message');
    console.error('  Detail:', err.detail || 'no detail');
    console.error('  Code:', err.code || 'no code');
    console.error('  Position:', err.position || 'n/a');
    console.error('  Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
  }
}

module.exports = { pool, initSchema };
