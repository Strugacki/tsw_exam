/*jshint node: true */
var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Account = require('../models/account');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

//Secret account creating route for admin
router.route('/registration').get(function(req,res,next){
   res.render('user/registration',{errors: null}); 
}).post(function(req,res,next){
       Account.register(new Account({username : req.body.username,
                                firstName : req.body.firstName,
                                lastName : req.body.lastName,
                                email : req.body.email,
                                password : req.body.password,
                                role: 'admin',
                                isActive: true}),
                               req.body.password, function(err){
       if(err){
           console.log('error while user register!',err);
           return res.render('/user/registration',{account: account, errors: validationErrors});
       }
       console.log('user registered!');
           passport.authenticate('local')(req, res, function () {
                res.redirect('/');
       });
   });
   
});

//Login route
router.get('/login',function(req,res){
   res.render('user/login', {user: req.user, msg: null}); 
});

//Post handler for login action
router.post('/login', passport.authenticate('local'), function(req, res){
    console.log(req.user.username);
    if(!req.user.isActive){
        req.logout();
        res.render('user/login', {user: req.user, msg: 'Twoje konto nie jest aktywne. Skontaktuj się z adminitratorem!'}); 
    }else{
       res.redirect('/');  
    }
});

//Logout handler
router.all('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
