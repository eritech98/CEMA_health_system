
import express from 'express';
import pool from '../Database/db.js';

const getAllusers = express.Router();

getAllusers.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        d.id AS doctor_id,
        d.full_name AS doctor_name,
        d.email AS doctor_email,
        d.is_verified,
        d.created_at,
        json_agg(
          json_build_object(
            'id', c.id,
            'full_name', c.full_name,
            'email', c.email,
            'phone', c.phone
          )
        ) FILTER (WHERE c.id IS NOT NULL) AS clients
      FROM doctors d
      LEFT JOIN clients c ON d.id = c.doctor_id
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `;

    const result = await pool.query(query);
    res.status(200).json({ users: result.rows });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default getAllusers;
