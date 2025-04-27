import express from 'express';
import pool from '../../Database/db.js';
import bcrypt from 'bcrypt';
import transporter from '../../Transporter/email.js';
import dotenv from 'dotenv';

const signup_post = express.Router();

signup_post.post('/', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new doctor into the database
    const doctor = await pool.query(
      'INSERT INTO doctors (full_name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [full_name, email, hashedPassword]
    );

    // Generate a verification token
    const token = Math.random().toString(36).substring(2, 15);

    // Insert the verification token into the database
    await pool.query(
      'INSERT INTO email_verifications (doctor_id, token) VALUES ($1, $2)',
      [doctor.rows[0].id, token]
    );
    
const verificationUrl = `https://medportal.up.railway.app:${process.env.PORT}/verify/${token}`;

await transporter.sendMail({
  to: email,
  subject: 'Verify your account',
  html: `<a href="${verificationUrl}">Click to verify</a>`,
});

    res.send('Signup successful. Please verify your email.');
  } catch (error) {
    console.error('Error during signup:', error);

    // Check for duplicate email error
    if (error.code === '23505') {
      return res.status(400).send('Email already registered. Please use a different email.');
    }

    // Handle other errors
    res.status(500).send('Internal Server Error');
  }
});

export default signup_post;
