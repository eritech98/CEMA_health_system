
import express from 'express';
import pool from '../Database/db.js';

const programs = express.Router();

programs.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        d.id AS doctor_id,
        d.full_name AS doctor_name,
        d.email AS doctor_email,
        json_agg(DISTINCT p.name) FILTER (WHERE p.id IS NOT NULL) AS programs
      FROM doctors d
      LEFT JOIN clients c ON d.id = c.doctor_id
      LEFT JOIN enrollments e ON c.id = e.client_id
      LEFT JOIN programs p ON e.program_id = p.id
      GROUP BY d.id
      ORDER BY d.full_name
    `;

    const result = await pool.query(query);
    res.status(200).json({ doctors: result.rows });
  } catch (err) {
    console.error('Error fetching programs per doctor:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default programs;
