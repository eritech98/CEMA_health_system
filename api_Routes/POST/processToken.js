import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../../Database/db.js';

const processToken = express.Router();

processToken.post("/:token", async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  // Verify token
  const result = await pool.query(
    "SELECT * FROM password_resets WHERE token = $1 AND used = false AND expires_at > NOW()",
    [token]
  );

  if (result.rows.length === 0) {
    return res.send("Invalid or expired token.");
  }

  const doctorId = result.rows[0].doctor_id;

  // Update password
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query("UPDATE doctors SET password = $1 WHERE id = $2", [hashedPassword, doctorId]);

  // Mark token as used
  await pool.query("UPDATE password_resets SET used = true WHERE token = $1", [token]);

  res.send('Password updated successfully. You can now <a href="/login">login</a>.');
});


export default processToken;