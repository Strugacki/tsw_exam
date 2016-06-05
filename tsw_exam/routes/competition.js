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
var _ = require('lodash');

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
    
    Competition.find({}).lean().exec(function(err,competitions){
        console.log(competitions);
       res.json(competitions); 
    });

});


router.get('/list',function(req,res){
     var role = 'public';
    if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            Competition.find({}).populate('groups').lean().exec(function(err,competitions){
                res.json(competitions);
            });
        }else{
            if(req.user.hasAccess('referee')){
                console.log('REFEREE');
                role = 'referee';
            }
            res.render('index', {user: req.user, userRole: role, msg: 'Nie posiadasz odpowiednich uprawnień!'});
        }
    }else{
        res.render('user/login',{user: req.user, msg: 'Zalogu się na konto administratora!'});
    }
});


//Activate Referee's Account
router.get('/activator/:competition_id',function(req,res){
    var role = 'public';
     if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            console.log("DEACTIVATING HORSE");
            var value = false;
            Competition.findOne({_id:req.params.competition_id},function(err,competition){
                console.log(competition.isActive);
                if(competition.isActive){
                    value = false;
                    console.log(value);
                }else{
                    console.log(value);
                    value = true;
                }
                competition.update({isActive: value}, function(error){
                    console.log('dupe');
                    console.log(error);
                });
                Competition.find({}).lean().exec(function(err,competition){
                    res.json(competition);
                });
            });
            //TO-DO   
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

router.route('/rate').get(function(req,res,next){
    var role = 'public';
    console.log('weszlo');
    if(req.user){
        if(req.user.hasAccess(['public','referee'])){
            console.log("REFEREE");
            console.log(req.user._id);
            Competition.findOne({isActive: true}).populate('groups').populate('referees').lean().exec(function(err,competition){
                var hasPermission = false;
                var groupToRateId = null;
                var array = [];
                var value;
                var userId;
                for(var i = 0;i<competition.groups.length;i++){
                    array = competition.groups[i].referees;
                    for(var j = 0;j<array.length;j++){
                        var value = String(array[j]);
                        var userId = String(req.user._id);
                        if(value === userId){
                            hasPermission = true;
                            groupToRateId = String(competition.groups[i]._id);
                            console.log(hasPermission);
                            console.log(groupToRateId);
                        }
                    }
                }
                if(hasPermission){
                    Group.find({_id: groupToRateId}).populate('horses').lean().exec(function(err,horses){
                        console.log(horses[0]);
                        res.json(horses);
                    });
                }
                
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
});



module.exports =router;