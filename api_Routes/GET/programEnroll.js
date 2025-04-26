import express from 'express';
const programEnroll = express.Router();
import pool from '../../Database/db.js';
import session from "express-session";

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect('/login');
  next();
}

programEnroll.get('/', requireLogin, async (req, res) => {
  const clients = await pool.query('SELECT * FROM clients');
  const programs = await pool.query('SELECT * FROM programs');
  res.render('enrollClient', { clients: clients.rows, programs: programs.rows });
});

export default programEnroll;