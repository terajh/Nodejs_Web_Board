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
        res.render('user_board', {
            title: results
        });
    });
});

module.exports = router;