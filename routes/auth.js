var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var auth = require('../lib/auth');
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var Auth = require('../lib/auth.js');
var compression = require('compression');

router.use(compression());


router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static(path.join(__dirname, 'data')));
// 정적 페이지 경로 미리 설정

module.exports = function(passport) {
    router.post('/login_process',
        passport.authenticate('local', { // local 전략을 이용해 인증하겠다는 의미.
            successRedirect: '/', // 성공시
            failureRedirect: './', // 실패시
            failureFlash: true
        }));

    // router.get('/login', (req, res) => {
    //     var fmsg = req.flash();
    //     var feedback = '';
    //     var AuthStatusUI = Auth.statusUI(req, res);
    //     if (fmsg.error) {
    //         feedback = fmsg.error[0];
    //     }
    //     console.log(feedback);
    //     res.render('login', {
    //         title: req.list,
    //         description: feedback,
    //         AuthStatusUI: AuthStatusUI
    //     });
    // });

    router.get('/logout', (req, res) => {
        req.logout();
        req.session.save(function(err) {
            res.redirect('/');
        });
    })
    return router;
}