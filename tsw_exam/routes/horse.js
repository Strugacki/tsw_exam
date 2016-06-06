var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Horse = require('../models/horse');
var router = express.Router();

//Adding a new Referee(Account) to database
router.route('/add').get(function(req, res, next) {
    console.log("HORSE GET");
    var role = 'public';
    if (req.user) {
        if (req.user.hasAccess(['admin', 'public', 'referee'])) {
            console.log("ADMIN");
            res.json('OK');
        } else {
            if (req.user.hasAccess('public', 'referee')) {
                console.log('REFEREE');
                role = 'referee';
            }
            console.log(role);
            res.render('index', {
                user: req.user,
                userRole: role,
                msg: 'Nie posiadasz odpowiednich uprawnień!'
            });
        }
    } else {
        res.render('user/login', {
            user: req.user,
            msg: 'Zalogu się na konto administratora!'
        });
    }
}).post(function(req, res, next) {
    console.log('body: ' + JSON.stringify(req.body));
    var horseToAdd = new Horse({
        horseName: req.body.horseName,
        sex: req.body.sex,
        birthDate: req.body.birthDate,
        ownerFirstName: req.body.ownerFirstName,
        ownerLastName: req.body.ownerLastName,
        isActive: true,
        isVoteActive: false,
    });
    horseToAdd.save(function(err) {
        if (err) {
            console.log('error while adding horse!', err);
            return res.render('horse/add', {
                horse: horseToAdd,
                errors: err
            });
        }
        console.log('horse added!');
        Horse.find({}).lean().exec(function(err, horses) {
            res.json(horses);
        });
    });
});


//Getting a list of Referees(Account) from Database and displaying in table
router.get('/list', function(req, res) {
    var role = 'public';
    if (req.user) {
        if (req.user.hasAccess(['admin', 'public', 'referee'])) {
            console.log("ADMIN");
            Horse.find({}).lean().exec(function(err, horses) {
                console.log(JSON.stringify(horses));
                res.json(horses);
            });
        } else {
            if (req.user.hasAccess('referee')) {
                console.log('REFEREE');
                role = 'referee';
            }
            res.render('index', {
                user: req.user,
                userRole: role,
                msg: 'Nie posiadasz odpowiednich uprawnień!'
            });
        }
    } else {
        res.render('user/login', {
            user: req.user,
            msg: 'Zalogu się na konto administratora!'
        });
    }
});


//Editing an existing Referee(User)
router.get('/edit/:horse_id', function(req, res) {
    var role = 'public';
    if (req.user) {
        if (req.user.hasAccess(['admin', 'public', 'referee'])) {
            console.log("ADMIN");
            Horse.findOne({
                _id: req.params.horse_id
            }, function(err, horse) {
                res.json(horse);
            });
        } else {
            if (req.user.hasAccess('referee')) {
                console.log('REFEREE');
                role = 'referee';
            }
            res.render('index', {
                user: req.user,
                msg: 'Nie posiadasz odpowiednich uprawnień!'
            });
        }
    } else {
        res.render('user/login', {
            user: req.user,
            msg: 'Zalogu się na konto administratora!'
        });
    }
});

router.post('/edit/:horse_id', function(req, res) {
    Horse.findOne({
        _id: req.params.horse_id
    }, function(err, horse) {
        horse.update({
            horseName: req.body.horseName,
            sex: req.body.sex,
            birthDate: req.body.birthDate,
            ownerFirstName: req.body.ownerFirstName,
            ownerLastName: req.body.ownerLastName
        }, function(error) {
            console.log('dupe');
            res.render('horse/edit/', {
                user: req.user,
                horse: horse,
                errors: 'Nie udało się dokonać aktualizacji!'
            });
        });
        if (err) {
            console.log('dupe');
            res.render('horse/edit/', {
                user: req.user,
                horse: horse,
                errors: 'Nie udało się dokonać aktualizacji!'
            });
        } else {
            Horse.find({}).lean().exec(function(err, horses) {
                console.log(JSON.stringify(horses));
                res.json(horses);
            });
        }
    });
});

router.get('/get/:horse_id',function(req,res){
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess(['public','referee'])){
            console.log("REFEREE");
            Competition.findOne({isActive: true}).populate('groups').populate('horses').populate('referees').lean().exec(function(err,competition){
                console.log(competition.referees);
                console.log(competition.horses);
                var hasPermission = false;
                var groupToRateId = null;
                var array = [];
                var value;
                var userId;
              /*  for(var i = 0;i<competition.groups.length;i++){
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
                    Group.findOne({_id: groupToRateId}).populate('horses').lean().exec(function(err,group){
                        console.log(group.horses);
                        res.json(group);
                    });
                }*/
                
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

//Activate Referee's Account
router.get('/activator/:horse_id', function(req, res) {
    var role = 'public';
    if (req.user) {
        if (req.user.hasAccess(['admin', 'public', 'referee'])) {
            console.log("ADMIN");
            console.log("DEACTIVATING HORSE");
            var value = false;
            Horse.findOne({
                _id: req.params.horse_id
            }, function(err, horse) {
                console.log(horse.isActive);
                if (horse.isActive) {
                    value = false;
                    console.log(value);
                } else {
                    console.log(value);
                    value = true;
                }
                horse.update({
                    isActive: value
                }, function(error) {
                    console.log('dupe');
                    console.log(error);
                });
                Horse.find({}).lean().exec(function(err, horses) {
                    res.json(horses);
                });
            });
            //TO-DO   
        } else {
            if (req.user.hasAccess('referee')) {
                console.log('REFEREE');
                role = 'referee';
            }
            res.render('index', {
                user: req.user,
                userRole: role,
                msg: 'Nie posiadasz odpowiednich uprawnień!'
            });
        }
    } else {
        res.render('user/login', {
            user: req.user,
            msg: 'Zalogu się na konto administratora!'
        });
    }
});

router.get('/rateActivator/:horse_id', function(req, res) {
    var role = 'public';
    if (req.user) {
        if (req.user.hasAccess(['admin', 'public', 'referee'])) {
            console.log("ADMIN");
            console.log('HORSE RATE ACTIVATING');
            console.log(req.params.horse_id);
            var value = false;
            Horse.findOne({
                _id: req.params.horse_id
            }, function(err, horse) {
                console.log(horse);
                console.log('HORSE VOTE ACTIVATION STATUS: ' + horse.isVoteActive);
                if (horse.isVoteActive) {
                    value = false;
                    console.log(value);
                } else {
                    console.log(value);
                    value = true;
                }
                horse.update({
                    isVoteActive: value
                }, function(error) {
                    console.log(error);
                });
                res.json('OK');
            });
            //TO-DO   
        } else {
            if (req.user.hasAccess('referee')) {
                console.log('REFEREE');
                role = 'referee';
            }
            res.render('index', {
                user: req.user,
                userRole: role,
                msg: 'Nie posiadasz odpowiednich uprawnień!'
            });
        }
    } else {
        res.render('user/login', {
            user: req.user,
            msg: 'Zalogu się na konto administratora!'
        });
    }
});

module.exports = router;