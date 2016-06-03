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
    isActive: {type : Boolean},
    email: {type : String, required : true},
    group: [{ type: Schema.Types.ObjectId, ref: 'Group' }]
});

Account.plugin(passportLocalMongoose);
Account.plugin(mongooseRole,{
    roles: ['public','referee','admin'],
    accessLevels:{
        'public': ['public','admin','referee'],
        'admin':['admin'],
        'referee':['referee','admin']
    }
})
module.exports = mongoose.model('Account', Account);