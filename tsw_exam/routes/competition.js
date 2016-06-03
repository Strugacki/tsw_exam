var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Account = require('../models/account');
var Horse = require('../models/horse');
var Group = require('../models/group');
var Result = require('../models/result');
var Competition = require('../models/competition');
var router = express.Router();
var async = require('async');

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
    //Assign and Initialize variables with data from request
    var groups = [];
    var refereesReq = req.body.referees;
    var horsesReq = req.body.horses;
    var refereesInGroupNumber = req.body.refereesInGroupNumber;
    var horsesInGroupNumber = req.body.horsesInGroupNumber;
    
    //Function that gets random int value from a range between min and max
    function getRandomIndex(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    var refereesTmp = refereesReq;
    var horsesTmp = horsesReq;
    /*********************************************/
    //Creating groups
    for(var i = 0; i<req.body.groupsNumber; i++){
        console.log('GROUP:'+i);
        //Arrays for group
        var referees = [];
        var horses = [];
        /*********************************************/
        //Randomizing referees and assigning to group
        for(var j = 0;j<refereesInGroupNumber;j++){
            console.log('REFEREES TMP:' + refereesTmp);
            var index = getRandomIndex(0,(refereesTmp.length - 1));
            var refereeID = refereesTmp[index];
            console.log("INDEX:" + index +' ' + refereeID);
            refereesTmp.splice(index,1);
            console.log('REFEREES TMP:' + refereesTmp);
            referees.push(refereeID);
        }
        /*********************************************/
        //Randomizing horses and assigning to group
        for(var k = 0; k<horsesInGroupNumber;k++){
            console.log('Horses TMP:' + horsesTmp);
            var index1 = getRandomIndex(0,(horsesTmp.length - 1));
            var horseID = horsesTmp[index];
            console.log("INDEX1:" + index1 + ' ' + horseID);
            horsesTmp.splice(index1,1);
            horses.push(horseID); 
        }
        /*********************************************/
        //Creating new group
        var groupToAdd = new Group({
            referees: referees,
            horses: horses
        });
        console.log(groupToAdd._id);
        console.log(groupToAdd);
        console.log(groupToAdd['horses']);
        //Saving new group
        //Pushing new group id to array
        groups.push(groupToAdd);
    }
    
    async.each(groups,function(group,callback){
        group.save(function(err){
           if(err){
               console.log(err);
               callback();
           }else{
               console.log('Group has been added');
               callback();
           } 
        });
    });
    /*********************************************/
    //New competition variable and Initialization
    var competitionToAdd = new Competition({
        name: req.body.name,
        referees: refereesReq,
        horses: horsesReq,
        isActive: false,
        isReady: true,
        groups: groups
    });
    
    competitionToAdd.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log('Competition has been added');
        }
    });

});

module.exports =router;