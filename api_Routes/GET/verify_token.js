import express from 'express';
import pool from '../../Database/db.js';


const verify = express.Router();

verify.get('/:token', async (req, res) => {
  const result = await pool.query('SELECT doctor_id FROM email_verifications WHERE token = $1', [req.params.token]);
  if (result.rows.length > 0) {
    await pool.query('UPDATE doctors SET is_verified = true WHERE id = $1', [result.rows[0].doctor_id]);
    await pool.query('DELETE FROM email_verifications WHERE token = $1', [req.params.token]);
    res.send('Email verified. You can now log in.');
  } else {
    res.send('Invalid token.');
  }
});

export default verify;