var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');

var Horse = new Schema({
    horseName: {type : String, required : true},
    sex: {type : String, required : true},
    birthDate: {type : String, required : true},
    ownerFirstName: {type : String, required : true},
    ownerLastName: {type : String, required : true},
    isActive: {type : Boolean, required : true}
});

//Horse.plugin(passportLocalMongoose);
module.exports = mongoose.model('Horse', Horse);