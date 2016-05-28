var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Account = require('../models/account');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.route('/registration').get(function(req,res,next){
   res.render('user/registration',{}); 
}).post(function(req,res,next){
   //if(Account.findOne({email : req.body.email})){
       //console.log('user with these creditentials already exists!');
       //res.render('')
  // }else{
  /*  var username = req.body.username;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var password1 = req.body.password1;
    
    req.checkBody('username', 'Pole login nie może być puste!').notEmpty();
    req.checkBody('firstName','Pole z imieniem nie może być puste!').notEmpty();
    req.checkBody('lastName','Pole z nazwiskiem nie może być puste!').notEmpty();
    req.checkBody('email','Podaj poprawny adres email!').isEmail();
    req.checkBody('email','Pole z adresem email nie może być puste!').notEmpty();
    req.checkBody('password','Pole hasło nie może być puste!').notEmpty();
    req.checkBody('password1','Hasła nie pasują!').equals(req.body.password);*/
    //var validationErrors = req.validationErrors();
       Account.register(new Account({username : req.body.username,
                                firstName : req.body.firstName,
                                lastName : req.body.lastName,
                                email : req.body.email,
                                password : req.body.password,
                                role: 'user'}),
                               req.body.password, function(err){
       if(err){
           console.log('error while user register!',err);
           return res.render('/user/registration',{account: account});
       }
       console.log('user registered!');
       //req.login(account, function(err){
       //    res.redirect('/');
           passport.authenticate('local')(req, res, function () {
                res.redirect('/');
       })
   });
  // }
   
});

router.get('/login',function(req,res){
   res.render('user/login', {user: req.user}); 
});

router.post('/login', passport.authenticate('local'), function(req, res){
    console.log("Access: " + req.user.hasAccess('user'));
   res.redirect('/'); 
});

router.all('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
