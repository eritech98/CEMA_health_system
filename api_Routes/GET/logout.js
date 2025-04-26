import express from 'express';
import session from "express-session";
const logout = express.Router();

logout.get('/', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

export default logout;