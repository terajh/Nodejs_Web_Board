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

var authData = {
    email: 'terajh@gmail.com',
    password: '123123',
    nickname: 'terajoo'
}


router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static(path.join(__dirname, 'data')));
// 정적 페이지 경로 미리 설정

router.get('/login', (req, res) => {
    var AuthStatusUI = auth.statusUI(req, res);
    res.render('login', {
        title: req.list,
        description: "Hello to board",
        AuthStatusUI: AuthStatusUI
    });
});

router.post('/login_process', (req, res) => {
    var body = req.body;
    var email = body.email;
    var pwd = body.pwd;
    console.log(email);
    console.log(pwd);
    if (email === authData.email && pwd === authData.password) {
        req.session.is_login = true;
        req.session.nickname = authData.nickname;
        console.log(req.session);
        res.redirect('/');
    } else {

        res.redirect('/');
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    })
})

module.exports = router;