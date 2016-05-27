/*jshint node: true */
//Creates user account scheme in database(MongoDB)
var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var mongooseRole = require('mongoose-role');

var Account = new Schema({
    firstName: {type : String, required : true},
    lastName: {type : String, required : true},
    username: {type : String, required : true},
    password: {type : String},
    email: {type : String, required : true}
});

Account.plugin(passportLocalMongoose);
Account.plugin(mongooseRole,{
    roles: ['public','user','admin'],
    accessLevels:{
        'public': ['public','user','admin'],
        'user':['user','admin'],
        'admin':['admin']
    }
})
module.exports = mongoose.model('Account', Account);