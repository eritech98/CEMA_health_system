import express from 'express';

const forgotPassword = express.Router();

// Password Reset Request
forgotPassword.get('/', (req, res) => {
  res.render('forgotPassword');
});

export default forgotPassword;