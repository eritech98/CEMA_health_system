import express from 'express';
import pool from '../Database/db.js';

const getClients = express.Router();

getClients.get('/:id', async (req, res) => {
  const client = await pool.query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
  const programs = await pool.query('SELECT p.name FROM programs p JOIN enrollments e ON e.program_id = p.id WHERE e.client_id = $1', [req.params.id]);
  res.json({ ...client.rows[0], programs: programs.rows.map(p => p.name) });
});

export default getClients;