import express from 'express';
import session from "express-session";

const addProgram  = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.doctorId) return res.redirect('/login');
  next();
}

addProgram.get('/', requireLogin, (req, res) => {
  res.render('addProgram');
});

export default addProgram;