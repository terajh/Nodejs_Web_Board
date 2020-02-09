var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var auth = require('../lib/auth');
var compression = require('compression');
var db = require('../lib/db.js');

router.use(compression());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */

router.get('/', function(req, res) {
    var AuthStatusUI = auth.statusUI(req, res)
    db.query(`SELECT * FROM topic`, (error, topic) => {
        res.render('index', {
            title: topic,
            description: "Hello to board",
            AuthStatusUI: AuthStatusUI
        });
    })

});

router.get('/board', (req, res, next) => {
    var AuthStatusUI = auth.statusUI(req, res);
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id`, (error, topic) => {
        if (error) throw error;
        res.render('board', {
            title: topic,
            AuthStatusUI: AuthStatusUI
        })
    })
})
router.get('/create', (req, res, next) => {
    var AuthStatusUI = auth.statusUI(req, res);
    if (!auth.IsOwner(req, res)) {
        res.redirect('/');
        return false;
    }
    db.query(`SELECT * FROM topic`, (error, topic) => {
        res.render('create', {
            title: topic,
            AuthStatusUI: AuthStatusUI
        });
    })

});

router.post('/create_process', (req, res, next) => {
    var post = req.body;
    var title = post.new_title;
    var description = post.new_description;
    if (!auth.IsOwner(req, res)) {
        res.redirect('/');
        return false;
    }
    db.query(`INSERT INTO topic (title,description,created,name) SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id VALUES('${title}', '${description}',NOW(),'${req.user.nickname}')`, (error, topic) => {
        if (error) throw error;
        res.redirect(`data=${topic.insertId}`);
    })
});

router.get('/data/:pageId', (req, res, next) => {
    var id = req.params.pageId;
    var AuthStatusUI = auth.statusUI(req, res);
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id`, (error, result) => {
        var topics = result;
        db.query(`SELECT * FROM topic WHERE title='${id}'`, (error, topic) => {
            console.log(topic[0])
            res.render('data', {
                title: topics,
                description: topic[0].description,
                update: topic[0].title,
                delete_: topic[0].title,
                AuthStatusUI: AuthStatusUI
            })
        })
    });


})
router.get('/update/:pageId', (req, res, next) => {
    var AuthStatusUI = auth.statusUI(req, res);
    if (!auth.IsOwner(req, res)) {
        res.redirect('/');
        return false;
    }
    db.query(`SELECT name FROM topic LEFT JOIN author ON topic.author_id=author.id`, (error, name) => {
        if (name != req.user.nickname) {
            res.send('<script type="text/javascript">alert("unexisted file"); location.href="/";</script>')
            return false;
        }
    })
    db.query(`SELECT * FROM topic`, (error, topic) => {
        res.render('update', {
            title: topic,
            update: req.params.pageId,
            AuthStatusUI: AuthStatusUI
        });
    })
})
router.post('/update_process', (req, res, next) => {
    if (!auth.IsOwner(req, res)) {
        res.redirect('/');
        return false;
    }
    var body = req.body;
    var old_title = body.old_title;
    var new_title = body.new_title;
    var description = body.new_description;
    db.query(`UPDATE topic SET title='${new_title}',description='${description}' WHERE title='${old_title}'`, (error, results) => {
        console.log('update topic tables');
        res.redirect(`../board`);
    })
})
router.post('/delete', (req, res, next) => {
    if (!auth.IsOwner(req, res, next)) {
        res.status(401).send('<script type="text/javascript">alert("err"); location.href="/";</script>');
        return false;
    }
    var body = req.body;
    var delId = body.delId;
    console.log(delId);
    db.query(`DELETE FROM topic WHERE title=${delId}`, (error, result) => {
        res.redirect('/board');
    })
})

router.post('/find', (req, res) => {
    var body = req.body;
    var find_title = body.find_title;
    var AuthStatusUI = auth.statusUI(req, res);

    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE title='${find_title}'`, (error, result) => {
        console.log(result);
        if (!result[0]) {
            console.log(1);
            res.status(401).send('<script type="text/javascript">alert("No file"); location.href="/";</script>');
            return false;
        } else {
            console.log(0);
            res.render('find', {
                title: result,
                AuthStatusUI: AuthStatusUI
            });
        }
    });

})

module.exports = router;