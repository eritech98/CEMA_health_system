import express from 'express';
const dashboard = express.Router();
import pool from '../../Database/db.js';
import session from "express-session";

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect('/login');
  next();
}

dashboard.get('/', requireLogin, async (req, res) => {
  const clients = await pool.query('SELECT * FROM clients');
  res.render('dashboard', { clients: clients.rows });
});

export default dashboard;