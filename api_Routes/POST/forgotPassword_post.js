import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import transporter from '../../Transporter/email.js';
import pool from '../../Database/db.js';

dotenv.config();

const forgotPassword_post = express.Router();

forgotPassword_post.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if doctor exists
    const doctor = await pool.query("SELECT * FROM doctors WHERE email = $1 AND is_verified = true", [email]);
    if (doctor.rows.length === 0) {
      return res.send("If this email exists and is verified, a reset link has been sent.");
    }

    // Create reset token
    const token = crypto.randomBytes(32).toString("hex");
    await pool.query(
      "INSERT INTO password_resets (doctor_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 minutes')",
      [doctor.rows[0].id, token]
    );

    // Send email
    const resetLink = `http://localhost:${process.env.PORT}/reset-password/${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `Click <a href="${resetLink}">here</a> to reset your password. Link expires in 30 minutes.`
    });

    res.send("If this email exists, a reset link has been sent.");
  } catch (error) {
    console.error("Error processing password reset request:", error);

    if (error.code === '23505') { 
      return res.status(400).send("An error occurred while generating the reset link. Please try again.");
    }

    res.status(500).send("An error occurred while processing your request. Please try again later.");
  }
});

export default forgotPassword_post;
