var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    //console.log("Access: " + req.session.user.hasAccess('user'));
    var role = 'guest';
    if(req.user){
        if(req.user.hasAccess('user')){
            role = 'user';
        }else if(req.user.hasAccess('admin')){
            role = 'admin';
        }else if(req.user.hasAccess('referee')){
            role = 'referee';
        }
    }
  res.render('index',{user : req.user, views : req.session.user, userRole: role});
});

module.exports = router;
