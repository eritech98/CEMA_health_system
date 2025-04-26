import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: 5432,
});

export default pool;
