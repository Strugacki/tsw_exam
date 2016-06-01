var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Horse = require('../models/horse');
var router = express.Router();

//Adding a new Referee(Account) to database
router.route('/add').get(function(req,res,next){
    console.log("HORSE GET");
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            res.json('OK');    
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
}).post(function(req,res,next){
       console.log('body: ' + JSON.stringify(req.body));
       var horseToAdd = new Horse({
                        horseName : req.body.horseName,
                        sex : req.body.sex,
                        birthDate : req.body.birthDate,
                        ownerFirstName : req.body.ownerFirstName,
                        ownerLastName : req.body.ownerLastName,
                        isActive : true
        });
       horseToAdd.save(function(err){
       if(err){
           console.log('error while adding horse!',err);
           return res.render('horse/add',{horse: horseToAdd, errors: err});
       }
       console.log('horse added!');
       Horse.find({}).lean().exec(function(err,horses){
            res.json(horses);
        });
   });   
});


//Getting a list of Referees(Account) from Database and displaying in table
router.get('/list',function(req,res){
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            Horse.find({}).lean().exec(function(err,horses){
               console.log(JSON.stringify(horses)); 
                res.json(horses);
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


//Editing an existing Referee(User)
router.get('/edit/:horse_id',function(req,res){
    var role = 'public';
     if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            Horse.findOne({_id:req.params.horse_id},function(err,horse){
                res.json(horse);
            });
        }else{
            if(req.user.hasAccess('referee')){
                console.log('REFEREE');
                role = 'referee';
            }
            res.render('index', {user: req.user, msg: 'Nie posiadasz odpowiednich uprawnień!'});
        }
    }else{
        res.render('user/login',{user: req.user, msg: 'Zalogu się na konto administratora!'});
    }
});

router.post('/edit/:horse_id',function(req,res){
    Horse.findOne({_id:req.params.horse_id},function(err,horse){
        horse.update({
            horseName : req.body.horseName,
            sex : req.body.sex,
            birthDate : req.body.birthDate,
            ownerFirstName : req.body.ownerFirstName,
            ownerLastName : req.body.ownerLastName
        }, function(error){
            console.log('dupe');
            res.render('horse/edit/',{user: req.user, horse: horse, errors: 'Nie udało się dokonać aktualizacji!'});
        });
        if(err){
            console.log('dupe');
            res.render('horse/edit/',{user: req.user, horse: horse, errors: 'Nie udało się dokonać aktualizacji!'});
        }else{
            Horse.find({}).lean().exec(function(err,horses){
               console.log(JSON.stringify(horses)); 
                res.json(horses);
            });
        }
    });
});



//Activate Referee's Account
router.get('/activator/:horse_id',function(req,res){
    var role = 'public';
     if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            console.log("DEACTIVATING HORSE");
            var value = false;
            Horse.findOne({_id:req.params.horse_id},function(err,horse){
                console.log(horse.isActive);
                if(horse.isActive){
                    value = false;
                    console.log(value);
                }else{
                    console.log(value);
                    value = true;
                }
                horse.update({isActive: value}, function(error){
                    console.log('dupe');
                    console.log(error);
                });
                Horse.find({}).lean().exec(function(err,horses){
                res.json(horses);
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

module.exports = router;