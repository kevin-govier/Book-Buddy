const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return; 
    } 

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try{
        const hashedPassword = await bcrypt.hash(password, 12);

        const userDetails = {
            name: name,
            email: email,
            password: hashedPassword
        };

        const result = await User.save(userDetails);

        res.status(201).json({ message: 'User registered' });
    } 
    catch (err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      const user = await User.find(email);      
  
      const isEqual = await bcrypt.compare(password, user.password);
  
      if (!isEqual) {
        const error = new Error('Wrong password.');
        error.statusCode = 401;
        throw error;
      }
  
      const token = jwt.sign(
        {
          email: user.email,
          userId: user.id
        },
        'secretfortoken',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: user.id });
    } catch (err) {
      res.status(401).json({ message: 'Authentication failed.' });
    }
  };