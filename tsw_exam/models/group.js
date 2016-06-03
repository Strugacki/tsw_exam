var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Group = new Schema({
    referees: [{type : Schema.Types.ObjectId, ref: 'accounts'}],
    horses: [{type : Schema.Types.ObjectId, ref : 'horses'}]
});

module.exports = mongoose.model('Group ', Group);