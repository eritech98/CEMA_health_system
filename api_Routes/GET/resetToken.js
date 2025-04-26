import express from 'express';
import pool from '../../Database/db.js';

const resetToken = express.Router();

// Password Reset Form
resetToken.get('/:token', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM password_resets WHERE token = $1 AND used = false AND expires_at > NOW()',
    [req.params.token]
  );

  if (result.rows.length === 0) {
    return res.send('Invalid or expired token.');
  }

  res.render('resetPassword', { token: req.params.token }); // Create this view
});

export default resetToken;


