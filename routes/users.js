var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var auth = require('../lib/auth.js');
var bodyParser = require('body-parser');
var path = require('path');
var compression = require('compression');

router.use(compression());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));
/* GET users listing. */
router.get('/', function(req, res, next) {
    var AuthStatusui = auth.statusUI(req, res);
    db.query(`SELECT * FROM users`, (error, results) => {
        if (error) throw error;
        res.render('users', {
            title: results
        });
    });
});
router.get('/board', (req, res, next) => {
    var AuthStatusui = auth.statusUI(req, res);
    db.query(`SELECT id,username,comment,date_format(created,'%m-%d %T') FROM userboard`, (error, results) => {
        if (error) throw error;
	    console.log(results);
        if (auth.IsOwner(req, res)) {
            res.render('users_board', {
                AuthStatusUI: AuthStatusui,
                usr: req.user.nickname,
                title: results
            });
        } else {
            res.render('users_board', {
                AuthStatusUI: AuthStatusui,
                title: results,
                usr: ""
            });
        }

    })
})
router.post('/board_process', (req, res, next) => {
    var post = req.body;
    var description = post.description;
    var AuthStatusui = auth.statusUI(req, res);
    console.log('create comment');
    db.query(`INSERT INTO userboard (username,comment,created) VALUES('${req.user.nickname}', '${description}',NOW())`, (error, userboard) => {
        res.redirect('/users/board')
    });
})

router.post('/delete_comment', (req, res, next) => {
    var post = req.body;
    var delId = post.id;
    var AuthStatusui = auth.statusUI(req, res);
    // console.log('process');
    db.query(`DELETE FROM userboard WHERE id=${delId}`, (error, result) => {
        if (error) throw error;
        res.redirect('./board');
    });
})


module.exports = router;
