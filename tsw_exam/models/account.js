/*jshint node: true */
//Creates user account scheme in database(MongoDB)

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    firstName: String,
    lastName: String,
    login: String,
    password: String,
    email: String,
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);