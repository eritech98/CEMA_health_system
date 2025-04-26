import express from 'express';
import pool from '../../Database/db.js';
import session from "express-session";

const ProgramsEnrol = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect('/login');
  next();
}

ProgramsEnrol.post("/", requireLogin, async (req, res) => {
  const { client_id, program_id } = req.body;

  try {
    await pool.query(
      "INSERT INTO enrollments (client_id, program_id) VALUES ($1, $2)",
      [client_id, program_id]
    );
    res.redirect(`/clients/${client_id}`);
  } catch (error) {
    console.error("Error enrolling client in program:", error);

    if (error.code === '23503') { // Example: handling foreign key violation
      return res.status(400).send("Invalid client ID or program ID.");
    }

    if (error.code === '23505') { // Example: handling unique constraint violation
      return res.status(400).send("This client is already enrolled in this program.");
    }

    res.status(500).send("An error occurred while enrolling the client. Please try again later.");
  }
});

export default ProgramsEnrol;
