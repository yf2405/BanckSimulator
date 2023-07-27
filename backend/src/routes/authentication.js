const express = require('express');
const router = express.Router();
const passport = require('passport');

const {  isLoggedIn, isNotLoggedIn, } = require('../lib/auth');

router.get('/signup', (req, res) => {
    res.render('auth/signUp');
  });
  
  
  
  router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));
  
  router.get('/login', isNotLoggedIn,(req, res) => {
    res.render('auth/login');
  });


router.post('/login', isNotLoggedIn,(req, res, next) => {
  passport.authenticate('local.login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/profile', isLoggedIn,(req, res) => {
  res.render('profile');
});

// authentication.js

// ... Otras rutas y configuraciones ...

router.get('/logout',  (req, res) => {
    req.logout( (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/login');
    });
  });
  
  // Exportar el enrutador
  module.exports = router;
  
  
module.exports = router;
