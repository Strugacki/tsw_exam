var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Result = new Schema({
    overall: {type: Number},
    partialHead: {type: Number},
    partialNeck: {type: Number},
    partialKloda: {type: Number},
    partialLegs: {type: Number},
    partialMove: {type: Number},
    isReady: {type: Boolean},
    horse: {type: Schema.Types.ObjectId, ref: 'Horse'},
    competition: {type: Schema.Types.ObjectId, ref: 'Competition'}
});

module.exports = mongoose.model('Result',Result);