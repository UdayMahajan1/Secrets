var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/secrets', async function (req, res) {
    // console.log(req.isAuthenticated());  
    if(!req.isAuthenticated()) {
        res.redirect('/login') ;
    } else {
        const allUsers = await Account.find({secret : {$ne: null}}).exec();
        try {
            console.log(allUsers);
            res.render('secrets', {allUsers: allUsers}) ;
        } catch(err) {
            console.log(err);
        }
        res.render('secrets');
    }
});

router.get('/submit', function(req, res) {
    if(!req.isAuthenticated()) {
        res.redirect('/login') ;
    } else {
        res.render('submit') ;
    }
});

router.post('/submit', async function (req, res) {
    var userSecret = req.body.secret;
    const query = Account.where({ _id: req.user.id });
    const result = await query.findOne();
    try {
        result.secret = userSecret;
        var update = await result.save();
        try{
            console.log(update);  
            res.redirect('/secrets');
        } catch (err) {
            console.log(err);
        }

    } catch(err) {
        console.log(err);
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

router.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), function(req, res) {
    res.redirect('/secrets');
});

router.get('/', function(req, res){
    res.render('home');
});

module.exports = router;