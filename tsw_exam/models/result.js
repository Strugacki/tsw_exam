var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');

var Result = new Schema({
    overall:{type: Number},
    horses: {type: Schema.Types.ObjectId, ref: 'Horse'},
    competition: {type: Schema.Types.ObjectId, ref: 'Competition'}
});

//Results.plugin(passportLocalMongoose);
module.exports = mongoose.model('Result',Result);