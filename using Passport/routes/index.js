var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


router.get('/secrets', function (req, res) {
    if(!req.user) {
        res.redirect('/login') ;
    } else {
        res.render('secrets') ;
    }
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            console.log(err);
            res.redirect('/register');
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/secrets');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
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

router.get('/', function(req, res){
    res.render('home');
});

module.exports = router;