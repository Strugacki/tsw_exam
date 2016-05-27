var express = require('express');
//express session handling
var session = require('express-session');
//mongodb
var mongoose = require('mongoose');
//authorization library for app
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//bunch of typical for node stuff
var errorHandler = require('errorhandler');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');


//Routes assign to variables
var routes = require('./routes/index');
var user = require('./routes/user');
var contest = require('./routes/contest');
var horse = require('./routes/horse');
var result = require('./routes/result');

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

/**************************************************/
//Creating session 
app.use(session({
    secret: '$uper $ecret', //used in encrypted sessions, must be unique
    resave: true, //updated session on each view
    saveUninitialized: false //store sessions
}));

/**************************************************/
//adding static references to resources
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));
app.use(express.static(path.join(__dirname, 'bower_components/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, 'bower_components/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, 'bower_components/bootstrap/dist/fonts')));
/***************Passport and Mongo*****************/
//Connecting to mongoDB and checking if connection is OK
mongoose.connect('mongodb://localhost/tsw_exam', function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost');
  }
});


//passport configuraton for my app
app.use(passport.initialize());
app.use(passport.session());

/**************************************************/
//Account model initialization
var Account = require('./models/account');
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());//this and below store user login
passport.deserializeUser(Account.deserializeUser());


/**************************************************/
//Adding routes to application
app.use('/', routes);
app.use('/user', user);
//app.use('/contest', contest);
//app.use('/horse', horse);
//app.use('/result', result);

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
