var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Account = require('../models/account');
var Horse = require('../models/horse');
var Group = require('../models/group');
var Result = require('../models/result');
var router = express.Router();


router.route('/add').get(function(req,res){
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            var data = {};
            Account.find({role: 'referee'},function(err,referees){
                res.json(referees);
            });
        }else{
            if(req.user.hasAccess('public','referee')){
                console.log('REFEREE');
                role = 'referee';
            }
            console.log(role);
            res.render('index', {user: req.user,userRole: role, msg: 'Nie posiadasz odpowiednich uprawnień!'});
        }
    }else{
        res.render('user/login',{user: req.user, msg: 'Zalogu się na konto administratora!'});
    }
}).post(function(req,res){
    console.log(req.body.referees);
});

module.exports =router;