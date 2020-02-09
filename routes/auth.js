var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var compression = require('compression');
var db = require('../lib/db.js');
router.use(compression());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));
// 정적 페이지 경로 미리 설정

module.exports = function(passport) {
    router.post('/login_process',
        passport.authenticate('local', { // local 전략을 이용해 인증하겠다는 의미.
            successRedirect: '/', // 성공시
            failureRedirect: '/', // 실패시
            failureFlash: true
        }));

    router.get('/logout', (req, res) => {
        req.logout();
        req.session.save(function(err) {
            res.redirect('/');
        });
    })
    router.post('/register_process', (req, res) => {
        var body = req.body;
        var username = body.username;
        var password = body.password;
        var nickname = body.nickname;
        db.query(`INSERT INTO users (email,password,created,nickname) VALUES ('${username}','${password}',NOW(),'${nickname}')`, (error, results) => {
            if (error) throw error;
            res.redirect('/');
        })
    })
    return router;
}