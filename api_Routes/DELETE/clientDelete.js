import express from 'express';
import pool from '../../Database/db.js';
import session from "express-session";

const clientDelete = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect("/login");
  next();
}
// Delete client and all related data
clientDelete.delete("/:id", requireLogin, async (req, res) => {
  try {
    // This will cascade delete all enrollments due to ON DELETE CASCADE
    await pool.query("DELETE FROM clients WHERE id = $1", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


export default clientDelete;