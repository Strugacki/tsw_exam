var express = require('express');
var errorHandler = require('errorhandler');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var routes = require('./routes');
var app = express();
var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV || 'development';
var secret = process.env.SECRET || '$uper $secet';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
//obsługa danych typu appliction/json
app.use(bodyParser.json());
//obsługa danych typu application/x-ww-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({secret: secret}));
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));

if('development' == env){
    app.use(logger('dev'));
    app.use(errorHandler());
} else {
    app.use(logger('official'));
}

app.get('/', routes.index);

app.listen(port, function () {
    console.log("Serwer nasłuchuje na porcie: " + port);
});
