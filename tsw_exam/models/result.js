var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');

var Results = new Schema({});

//Results.plugin(passportLocalMongoose);
module.exports = mongoose.model('Results',Results);