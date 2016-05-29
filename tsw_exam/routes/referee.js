var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Account = require('../models/account');
var router = express.Router();

router.route('/add').get(function(req,res,next){
    if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            res.render('referee/add',{user: req.user, errors: null});    
        }else{
            res.render('index', {user: req.user, msg: 'Nie posiadasz odpowiednich uprawnień!'});
        }
    }else{
        res.render('user/login',{user: req.user, msg: 'Zalogu się na konto administratora!'});
    }
}).post(function(req,res,next){
   //if(Account.findOne({email : req.body.email})){
       //console.log('user with these creditentials already exists!');
       //res.render('')
  // }else{
    var username = req.body.username;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var password1 = req.body.password1;
    
    /*req.checkBody('username', 'Pole login nie może być puste!').notEmpty();
    req.checkBody('firstName','Pole z imieniem nie może być puste!').notEmpty();
    req.checkBody('lastName','Pole z nazwiskiem nie może być puste!').notEmpty();
    req.checkBody('email','Podaj poprawny adres email!').isEmail();
    req.checkBody('email','Pole z adresem email nie może być puste!').notEmpty();
    req.checkBody('password','Pole hasło nie może być puste!').notEmpty();
    req.checkBody('password1','Hasła nie pasują!').equals(req.body.password);
    var validationErrors = req.validationErrors();*/
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
       res.redirect('/');
   });   
});

router.get('/list',function(req,res){
    if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            Account.find({role: 'referee'}).lean().exec(function(err,referees){
               console.log(JSON.stringify(referees)); 
               res.render('referee/list',{user: req.user, errors: null, data: referees});  
            });  
        }else{
            res.render('index', {user: req.user, msg: 'Nie posiadasz odpowiednich uprawnień!'});
        }
    }else{
        res.render('user/login',{user: req.user, msg: 'Zalogu się na konto administratora!'});
    }
});

module.exports = router;
