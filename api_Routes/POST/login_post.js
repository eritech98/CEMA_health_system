import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../../Database/db.js';
import session from "express-session";

const login_post = express.Router();

login_post.post("/", async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query("SELECT * FROM doctors WHERE email = $1", [email]);
  if (result.rows.length === 0) return res.send("Doctor not found.");
  const doctor = result.rows[0];
  const valid = await bcrypt.compare(password, doctor.password);
  if (!valid) return res.send("Incorrect password.");
  if (!doctor.is_verified) return res.send("Verify email first.");
  req.session.doctorId = doctor.id;
  res.redirect("/dashboard");
});

export default login_post;