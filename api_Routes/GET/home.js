import express from 'express';

const home = express.Router();

home.get('/', (req, res) => {
  res.redirect('/login');
});

export default home;