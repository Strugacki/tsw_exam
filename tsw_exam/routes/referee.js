var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Account = require('../models/account');
var router = express.Router();

//Adding a new Referee(Account) to database
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


//Getting a list of Referees(Account) from Database and displaying in table
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


//Editing an existing Referee(User)
router.get('/edit/:referee_id',function(req,res){
     if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            Account.findOne({role: 'referee', _id:req.params.referee_id},function(err,referee){
                res.render('referee/edit',{user: req.user, referee: referee, errors: null});
            });
        }else{
            res.render('index', {user: req.user, msg: 'Nie posiadasz odpowiednich uprawnień!'});
        }
    }else{
        res.render('user/login',{user: req.user, msg: 'Zalogu się na konto administratora!'});
    }
});

router.post('/edit/:referee_id',function(req,res){
    console.log(req.params.referee_id);
    Account.findById(req.params.referee_id,function(err,referee){
        referee.update({
            username : req.body.username,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : req.body.password
        }, function(error){
            console.log('dupe');
            res.render('referee/edit/',{user: req.user, referee: referee, errors: 'Nie udało się dokonać aktualizacji!'});
        });
        if(err){
            console.log('dupe');
            res.render('referee/edit/',{user: req.user, referee: referee, errors: 'Nie udało się dokonać aktualizacji!'});
        }else{
            res.redirect('/referee/list');
        }
    });
});


//Activate Referee's Account
router.get('/activate/:referee_id',function(req,res){
     console.log(req.params);
     if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            console.log("DEACTIVATING ACCOUNT");
            Account.findOne({role: 'referee',isActive: false, _id:req.params.referee_id},function(err,referee){
                referee.isActive = true;
                referee.save(function(err){
                   if(!err){
                       console.log("ACCOUNT ACTIVATED");
                       Account.find({role: 'referee'}).lean().exec(function(err,tableData){
                           res.json(tableData);  
                        }); 
                   }else{
                       console.log(err);
                   }
                });
            });
            //TO-DO   
        }else{
            res.render('index', {user: req.user, msg: 'Nie posiadasz odpowiednich uprawnień!'});
        }
    }else{
        res.render('user/login',{user: req.user, msg: 'Zalogu się na konto administratora!'});
    }
});

//Deactivate Referee's Account
router.get('/deactivate/:referee_id',function(req,res){
    console.log(req.params);
     if(req.user){
        if(req.user.hasAccess(['admin','public','referee'])){
            console.log("ADMIN");
            console.log("DEACTIVATING ACCOUNT");
            Account.findOne({role: 'referee',isActive: true, _id:req.params.referee_id},function(err,referee){
                referee.isActive = false;
                referee.save(function(err){
                   if(!err){
                       console.log("ACCOUNT DEACTIVATED");
                       Account.find({role: 'referee'}).lean().exec(function(err,tableData){
                           res.json(tableData);  
                        }); 
                   }else{
                       console.log(err);
                   }
                });
            });
            //TO-DO   
        }else{
            res.render('index', {user: req.user, msg: 'Nie posiadasz odpowiednich uprawnień!'});
        }
    }else{
        res.render('user/login',{user: req.user, msg: 'Zalogu się na konto administratora!'});
    }
});

module.exports = router;