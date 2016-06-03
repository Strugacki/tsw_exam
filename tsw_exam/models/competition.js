var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Competition = new Schema({
    name: {type: String, required: true},
    isReady: {type: Boolean},
    isActive: {type: Boolean},
    referees: [{type : Schema.Types.ObjectId, ref: 'Account'}],
    horses: [{type : Schema.Types.ObjectId, ref : 'Horse'}],
    groups: {type: Schema.Types.ObjectId, ref: 'Group'}
});

module.exports = mongoose.model('Competition ', Competition);