import express from 'express';

const signup = express.Router(); 
signup.get('/', (req, res) => {
  res.render('signup');
});

export default signup;