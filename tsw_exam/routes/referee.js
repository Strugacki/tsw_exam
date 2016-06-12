var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Account = require('../models/account');
var auth = require('passport-local-authenticate');
var router = express.Router();

//Adding a new Referee(Account) to database
router.route('/add').get(function(req,res,next){
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            res.json('OK');
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
}).post(function(req,res,next){
    console.log('body: ' + JSON.stringify(req.body));
       Account.register(new Account({username : req.body.username,
                                firstName : req.body.firstName,
                                lastName : req.body.lastName,
                                email : req.body.email,
                                password : req.body.password,
                                role: 'referee',
                                isActive: true}),
                               req.body.password, function(err){
       if(err){
           console.log('error while user register!',err);
           return res.render('/user/registration',{account: account, errors: validationErrors});
       }
       console.log('user registered!');
       Account.find({role: 'referee'}).lean().exec(function(err,referees){
            res.json(referees);
        });
   });   
});

//Getting a list of Referees(Account) from Database and displaying in table
router.get('/list',function(req,res){
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            Account.find({role: 'referee'}).lean().exec(function(err,referees){
               console.log(JSON.stringify(referees)); 
                res.json(referees);
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


//Editing an existing Referee(User)
router.get('/edit/:referee_id',function(req,res){
     var role = 'public';
     if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            Account.findOne({role: 'referee', _id:req.params.referee_id},function(err,referee){
                res.json(referee);
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

//Post handler for editing horse
router.post('/edit/:referee_id',function(req,res){
    console.log('body: ' + JSON.stringify(req.body));
    var newPassword = req.body.password;
    Account.findOne({role: 'referee', _id:req.params.referee_id},function(err,referee){
        var newPasswordHashed = null ;
        var newPasswordSalt = null;
        auth.hash(newPassword,function(err,hashed){
            console.log(hashed.hash);
            newPasswordHashed = hashed.hash;
            newPasswordSalt = hashed.salt;
            referee.update({
                username : req.body.username,
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                hash : newPasswordHashed,
                salt : newPasswordSalt,
                email : req.body.email,
                password : newPassword
            }, function(error){
                console.log(error);
            });
        });
    if(err){
        console.log(err);
    }else{
        Account.find({role: 'referee'}).lean().exec(function(err,referees){
            res.json(referees);
        });
    }
});
});


//Activator for Referee's Account
router.get('/activator/:referee_id',function(req,res){
    var role = 'public';
    console.log(req.params);
     if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            console.log("DEACTIVATING ACCOUNT");
            var value = false;
            Account.findOne({role: 'referee', _id: req.params.referee_id},function(err,referee){
                console.log(referee.isActive);
                if(referee.isActive){
                    value = false;
                    console.log(value);
                }else{
                    console.log(value);
                    value = true;
                }
                referee.update({isActive: value}, function(error){
                    console.log('dupe');
                    console.log(error);
                });
                Account.find({role: 'referee'}).lean().exec(function(err,referees){
                res.json(referees);
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