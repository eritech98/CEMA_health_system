import express from 'express';
import session from "express-session";

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect('/login');
  next();
}

const clientRegister = express.Router();
clientRegister.get('/', requireLogin, (req, res) => {
  res.render('registerClient');
});

export default clientRegister;
