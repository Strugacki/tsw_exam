var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Account = require('../models/account');
var Horse = require('../models/horse');
var Group = require('../models/group');
var router = express.Router();

router.get('/show/:group_id',function(req,res){
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            var data = {};
            data.referees = [];
            data.horses = [];
            Group.findOne({_id:req.params.group_id}).populate('referees').populate('horses').lean().exec(function(err,group){
                data.referees = group.referees;
                data.horses = group.horses;
                res.json(data);
            });
        }else{
            if(req.user.hasAccess('referee')){
                console.log('REFEREE');
                role = 'referee';
            }
            res.render('index', {user: req.user,userRole: role, msg: 'Nie posiadasz odpowiednich uprawnień!'});
        }
    }else{
        res.render('user/login',{user: req.user, msg: 'Zalogu się na konto administratora!'});
    } 
});

module.exports = router;