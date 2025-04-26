import express from 'express';
import pool from '../../Database/db.js';
import session from 'express-session';

const doctorDelete = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect("/login");
  next();
}


doctorDelete.delete("/", requireLogin, async (req, res) => {
  const doctorId = req.session.doctorId;

  if (!doctorId) {
    return res.status(400).send("Doctor ID not found in session");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start a transaction

    // Delete the doctor (cascading deletes will handle dependent records)
    await client.query("DELETE FROM doctors WHERE id = $1", [doctorId]);

    await client.query("COMMIT"); // Commit the transaction

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error destroying session");
      }
      res.sendStatus(200);
    });
  } catch (err) {
    await client.query("ROLLBACK"); // Rollback the transaction in case of error
    console.error(err);
    res.status(500).send("Error deleting account");
  } finally {
    client.release(); 
  }
});

export default doctorDelete;