var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Horse = require('../models/horse');
var Competition = require('../models/horse');
var Result = require('../models/result');
var router = express.Router();


router.post('/rate/horse/:id_horse',function(req,res){
    var horseId = req.params._id;
    var overall = req.body.overall;
    console.log('OVERALL: ' + overall);
    console.log('HORSE ID: ' + horseId);
    console.log('COMPETITION ID: ' + 0);
    Competition.findOne({isActive: true}).lean().exec(function(err,competition){
        var result = new Result({
            overall: overall,
            horse: horseId,
            competition: competition._id,
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

module.exports = router;