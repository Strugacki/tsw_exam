var express = require('express');
//express session handling
var session = require('express-session');
//mongodb
var mongoose = require('mongoose');
//authorization library for app
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var errorHandler = require('errorhandler');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon());
app.use(logger('dev'));
//obsługa danych typu appliction/json
app.use(bodyParser.json());
//obsługa danych typu application/x-ww-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser());
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: '$uper $ecret', //used in encrypted sessions, must be unique
    resave: true, //updated session on each view
    saveUninitialized: false //store sessions
}));

app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));

/***************Passport and Mongo*****************/

mongoose.connect('mongodb://localhost/tsw_exam', function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost');
  }
});


//passport configuraton for my app
app.use(passport.initialize());
app.use(passport.session());




//Account model initialization
var Account = require('./models/account');
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());//this and below store user login
passport.deserializeUser(Account.deserializeUser());

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
