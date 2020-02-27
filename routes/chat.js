var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var compression = require('compression');
var auth = require('../lib/auth');
var db = require('../lib/db.js');
var alert = require('alert-node');

var router = express.Router();
var http = require('http').Server(router);
var io = require('socket.io')(http);





router.use(compression());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, '../public')));
router.use(express.static(path.join(__dirname, '../node_modules')));
/* GET home page. */


router.get('/', function(req, res) {
    // console.log(req);
    var AuthStatusUI = auth.statusUI(req, res)
    // console.log(req.user);
    var user="";
    if(auth.IsOwner(req,res)){
        user=req.user.nickname;
        console.log('login chat application');
        res.render('chat',{
        AuthStatusUI:AuthStatusUI,
        user:user
        });
    } // session 의 nickname 값 확인
    else{
        // console.log()
        alert('Need Login');
        res.send("<script> window.alert('Need Login'); window.location.href='http://localhost:3000/' </script>");
    }
});




module.exports = router;