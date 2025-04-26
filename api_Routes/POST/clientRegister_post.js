import express from 'express';
import pool from '../../Database/db.js';
import session from "express-session";
import transporter from '../../Transporter/email.js';

const clientRegister_post = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect("/login");
  next();
}

clientRegister_post.post("/", requireLogin, async (req, res) => {
  const { full_name, email, phone } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO clients (doctor_id, full_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.session.doctorId, full_name, email, phone]
    );

    await transporter.sendMail({
      to: email,
      subject: "Welcome!",
      text: `Hi ${full_name}, you were registered.`
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error registering client:", error);

    if (error.code === '23505') {
      return res.status(400).send("Email already registered.");
    }

    res.status(500).send("An error occurred while registering the client. Please try again later.");
  }
});

export default clientRegister_post;


