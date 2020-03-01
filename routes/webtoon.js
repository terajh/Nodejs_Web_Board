var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var auth = require('../lib/auth');
var compression = require('compression');
var db = require('../lib/db.js');

var alert = require('alert-node');

router.use(compression());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */

router.get('/', function(req, res) {
    var AuthStatusUI = auth.statusUI(req, res);
    db.query(`SELECT * FROM webtoonlist`, (error, webtoon) => {
        if (error) throw error;
        res.render('webtoonlist', {
            title: webtoon,
            AuthStatusUI: AuthStatusUI
        })
    })

});
router.get('/:title', (req, res, next) => {
    var title = req.params.title;
    var AuthStatusUI = auth.statusUI(req, res);
    console.log(title);
    db.query(`SELECT * FROM webtoonlist WHERE title='${title}'`, (error, result) => {
        console.log(result);
        res.render('webtoon', {
            title:result[0],
            AuthStatusUI: AuthStatusUI
        })
        
    });
})
router.get('/:title/:pageId', (req, res, next) => {
    var title = req.params.title;
    var id = req.params.pageId;
    var AuthStatusUI = auth.statusUI(req, res);
    db.query(`SELECT Lastepisode,src FROM webtoon LEFT JOIN webtoonlist ON webtoon.title=webtoonlist.title WHERE webtoon.title='${title}' AND webtoon.episode=${id}`, (error, result) => {
        res.render('showwebtoon', {
            src:result,
            AuthStatusUI: AuthStatusUI,
            title:title
        });
    });
})
module.exports = router;