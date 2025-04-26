import express from 'express';
import pool from '../../Database/db.js';
import session from "express-session";

const clients = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect('/login');
  next();
}

clients.get('/:id', requireLogin, async (req, res) => {
  try {
    const client = await pool.query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
    const programs = await pool.query('SELECT p.name FROM programs p JOIN enrollments e ON p.id = e.program_id WHERE e.client_id = $1', [req.params.id]);

    if (client.rows.length === 0) {
      return res.status(404).send('Client not found');
    }

    res.render('clientProfile', { client: client.rows[0], programs: programs.rows });
  } catch (error) {
    console.error('Error fetching client data:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default clients;
