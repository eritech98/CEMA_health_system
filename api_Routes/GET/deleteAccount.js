import express from 'express';
import session from "express-session";
const deleteAccount = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect('/login');
  next();
}

deleteAccount.get('/', requireLogin, (req, res) => {
  res.render('confirmDoctorDelete');
});

export default deleteAccount;