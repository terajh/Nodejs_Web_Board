var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var compression = require('compression');
var fs = require('fs');
var auth = require('../lib/auth');
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var Auth = require('../lib/auth.js');



router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static(path.join(__dirname, 'data')));
// 정적 페이지 경로 미리 설정

router.get('/login', (req, res) => {
    if (Auth.IsOwner(req, res)) {
        res.render('login', {
            title: req.list,
            description: "Hello to board",
            AuthStatusUI: "login"
        });
    } else {
        res.render('login', {
            title: req.list,
            description: "Hello to board",
            AuthStatusUI: "logout"
        });
    }

});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.save(function(err) {
        res.redirect('/');
    });
})

module.exports = router;