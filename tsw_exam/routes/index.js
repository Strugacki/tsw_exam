var express = require('express');
var router = express.Router();
var Account = require('../models/account');

/* GET home page. */
router.get('/', function(req, res) {
    //console.log("Access: " + req.session.user.hasAccess('user'));
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess('public')){
            role = 'public';
            if(req.user.hasAccess('referee')){
                role = 'referee';
                if(req.user.hasAccess('admin')){
                    role = 'admin';
                }
            }
        }
    }
  res.render('index',{user : req.user, views : req.session.user, userRole: role, msg: null});
});

module.exports = router;
