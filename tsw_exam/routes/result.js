var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Horse = require('../models/horse');
var Competition = require('../models/competition');
var Result = require('../models/result');
var router = express.Router();


router.post('/rate/horse/:id_horse',function(req,res){
    var horseId = req.params.id_horse;
    var overall = req.body.overall;
    console.log('OVERALL: ' + overall);
    console.log('HORSE ID: ' + horseId);
    Competition.findOne({isActive: true}).lean().exec(function(err,competition){
        console.log('COMPETITION ID: ' + competition._id);
        var result = new Result({
            overall: overall,
            horse: horseId,
            competition: competition._id
        });
        result.save(function(error){
        if(error){
            console.log(error);
        }else{
            res.json('Dziękujemy za ocene!');
        }
    });  
    })
});


router.get('/show',function(req,res){
    Result.find({}).populate('competition').populate('horse').lean().exec(function(err,results){
        console.log(JSON.stringify(results));
        res.json(results);
    });
});

module.exports = router;