import express from 'express';
import session from 'express-session';
import pool from '../../Database/db.js';

const programAdd_post = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect('/login');
  next();
}

programAdd_post.post('/', requireLogin, async (req, res) => {
  try {
    const { name } = req.body;

    // Insert the new program into the database
    await pool.query('INSERT INTO programs (name) VALUES ($1)', [name]);

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error adding program:', error);

    // Check for specific errors, such as duplicate program name
    if (error.code === '23505') {
         console.log("Duplicate error detail:", error.detail);
      return res.status(400).send('Program name already exists. Please choose a different name.');
       
    }

    // Handle other errors
    res.status(500).send('Internal Server Error');
  }
});

export default programAdd_post;
