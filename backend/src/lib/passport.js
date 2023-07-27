const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require ('../database');
const helpers = require('../lib/helpers');


passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  }, async (req, username, password, done) => {
    const rows  = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(password, user.password);
      if (validPassword) {
        return done(null, user, req.flash('success_msg', 'welcome', user.username));
      } else {
        return done(null, false, req.flash('error_msg', 'Incorrect password'));
      }
    } else {
      return done(null, false, req.flash('error_msg', 'The username does not exist'));
    }
  }));
 
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password', // Corrected 'passwordField' instead of 'passportField'
  passReqToCallback: true
}, async (req, username, password, done) => {
    const {fullName} = req.body;
  const newUser = {
    username,
    password,
    fullName
};
  newUser.password = await helpers.encryptPassword(password);
  const result = await pool.query('INSERT INTO users SET ?',[newUser]);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) =>{
   done(null, user.id);
});

passport.deserializeUser(async (id, done) =>{
  const rows = await pool.query('Select * FROM users WHERE id = ?',[id]);
done(null, rows[0]);
});
module.exports = passport;