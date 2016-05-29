var express = require('express');
var router = express.Router();
var Account = require('../models/account');

/* GET home page. */
router.get('/', function(req, res) {
    //console.log("Access: " + req.session.user.hasAccess('user'));
    var role = 'public';
    if(req.user){
        if(req.user.hasAccess('public')){
            console.log('PUBLIC');
            role = 'public';
            if(req.user.hasAccess('referee')){
                console.log('REFEREE');
                role = 'referee';
                if(req.user.hasAccess('admin')){
                    console.log('ADMIN');
                    role = 'admin';
                }
            }
        }
    }
    console.log(req.msg);
  res.render('index',{user : req.user, views : req.session.user, userRole: role, msg: null});
});

module.exports = router;
