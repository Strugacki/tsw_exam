var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.route('/registration').get(function(req,res,next){
   res.render('user/registration',{}); 
}).post(function(req,res,next){
   if(Account.findOne({username : req.body.username}) || Account.findOne({email : req.body.email})){
       console.log('user with these creditentials already exists!');
       res.render('')
   }else{
       Account.register(new Account({username : req.body.username,
                                firstName : req.body.firstName,
                                lastName : req.body.lastName,
                                email : req.body.email}),
                               req.body.password, function(err){
       if(err){
           console.log('error while user register!',err);
           return next(err);
       }
       
       console.log('user registered!');
       res.redirect('/');
   });
   }
   
});

router.get('/login',function(req,res){
   res.render('user/login', {user: req.user}); 
});

router.post('/login', passport.authenticate('local'), function(req, res){
   res.redirect('/') 
});

router.all('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
