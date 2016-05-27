var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');

var Horse = new Schema({});

//Horse.plugin(passportLocalMongoose);
module.exports = mongoose.model('Horse', Horse);