//SSL https
var fs = require('fs');
var https = require('https');

var options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt')
}

var serverPort = 3000;

var express = require('express');
var expressValidator = require('express-validator');
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
var users = require('./routes/users');
var competition = require('./routes/competition');
var horse = require('./routes/horse');
var result = require('./routes/result');
var referee = require('./routes/referee');

var app = express();
//adding socket.io to app
var server = https.createServer(options,app);
var io = require('socket.io')(server);
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
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));
app.use(express.static(path.join(__dirname, 'bower_components/ejs')));
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
var Horse = require('./models/horse');
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());//this and below store user login
passport.deserializeUser(Account.deserializeUser());

//express validation for our model
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
/**************************************************/
//Adding routes to application
app.use('/', routes);
app.use('/users', users);
app.use('/referee', referee);
app.use('/horse', horse);
//app.use('/group', group);
app.use('/competition', competition);
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

//Socket.io listener for app
io.on('connection', function(socket){
    console.log('User connected to server');
    socket.emit('message','new connection');
    /*Account.find({role:'referee'},function(err,referees){
        socket.emit('referees',JSON.stringify(referees)); 
    });
    Horse.find({},function(err,horses){
       socket.emit('horses',JSON.stringify(horses)); 
    });*/
    //var referees = Account.find({role: 'referee'});
    //socket.emit('referees',referees);
    
    socket.on('reqH',function(data){
        Horse.find({},function(err,horses){
           socket.emit('horses',JSON.stringify(horses)); 
        });
    });
    socket.on('reqR',function(data){
        Account.find({role:'referee'},function(err,referees){
            socket.emit('referees',JSON.stringify(referees)); 
        });
    });
    
});

server.listen(serverPort,function(){
    console.log("Server running at port: "+serverPort);
});

module.exports = app;