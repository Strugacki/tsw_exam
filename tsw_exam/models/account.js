/*jshint node: true */
//Creates user account scheme in database(MongoDB)
var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    firstName: {type : String, required : true},
    lastName: {type : String, required : true},
    login: {type : String, required : true},
    password: {type : String, required : true},
    email: {type : String, required : true}
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);