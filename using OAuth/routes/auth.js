require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const Account = require('../models/account');

// local strategy configured directly by passport-local-mongoose
passport.use(new LocalStrategy(Account.authenticate()));

// google strategy configured by passport-google
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    scope: [ 'profile' ],
    state: true
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    Account.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// facebook strategy configured by passport-facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets",
    state: true
  },
  function(accessToken, refreshToken, profile, cb) {
    Account.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// passport config
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});
  
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

const router = express.Router();

router.get('/login', function(req, res) {
    res.render('login');
});

// google strategy
router.get('/auth/google', passport.authenticate('google'));

router.get('/auth/google/secrets',
passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
function(req, res) {
    res.redirect('/secrets');
});

// facebook strategy
router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

router.get('/logout', function(req, res) {
    req.logout((err)=>{
        if(err) {
            console.log(err);
        } 
        res.redirect('/');
    });
});

module.exports = router ;