require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
 
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session config
app.use(require('express-session')({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);

// mongoose
mongoose.connect(process.env.MONGODB_URI);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        // res.status(err.status || 500);
        // res.render('error', {
        //     message: err.message,
        //     error: err
        // });
        console.log(err) ;
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    // res.status(err.status || 500);
    // res.render('error', {
    //     message: err.message,
    //     error: {}
    // });
    console.log(err);
});

app.listen(3000, ()=>console.log("Server Running on port 3000"));

module.exports = app;