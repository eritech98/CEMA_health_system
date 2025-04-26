import express from 'express';

const login = express.Router();

login.get('/', (req, res) => {
  res.render('login');
});

export default login;