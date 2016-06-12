var express = require('express');
var passport = require('passport');
var expressValidator = require('express-validator');
var Horse = require('../models/horse');
var Competition = require('../models/competition');
var Result = require('../models/result');
var router = express.Router();

//Final update for result
router.post('/rate/horse/:id_horse',function(req,res){
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess(['public','referee'])){
            var horseId = req.params.id_horse;
            var overall = req.body.overall;
            var resultId = req.body.result_id;
            console.log('OVERALL: ' + overall);
            console.log('HORSE ID: ' + horseId);
            console.log('HORSE ID: ' + resultId);
            Result.findOne({_id: resultId}, function(err,result){
                console.log(result);
                console.log(JSON.stringify(result));
                result.update({
                    isReady: true,
                    overall: overall
                },function(err2){
                    if(err2){
                        console.log(err2);
                    }else{
                        res.json('Dziękujemy za ocene!');
                    }
                });
            });
        }
    }
});

//Single update handler for moving slider
router.post('/update/:id_results',function(req,res){
    console.log('jset');
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess(['public','referee'])){
            Result.findOne({_id: req.params.id_results},function(err,result){
                console.log(result);
                result.update({
                    partialHead: parseInt(req.body.head),
                    partialLegs: parseInt(req.body.legs),
                    partialKloda: parseInt(req.body.kloda),
                    partialMove: parseInt(req.body.move),
                    partialNeck: parseInt(req.body.neck)
                },function(err){
                    if(err){
                        console.log(err);
                    }else{
                        res.json('RATE UPDATED');
                    }
                });
            });
        }
    }
});

//Get data for creating results and champions table
router.get('/show',function(req,res){
    var data = {}
    Result.find({isReady: true}).populate('competition').populate('horse').lean().exec(function(err,results){
        console.log(JSON.stringify(results));
        data.results = results;
        Horse.find({}).lean().exec(function(err,horses){
            data.horses = horses ;
            Competition.find({}).lean().exec(function(err,competitions){
               data.competitions = competitions;
                res.json(data);
            });
        });
    });
});

module.exports = router;