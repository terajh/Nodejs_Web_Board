var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var auth = require('../lib/auth');
var compression = require('compression');

router.use(compression());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static(path.join(__dirname, 'data')));

/* GET home page. */

router.get('/', function(req, res) {
    var AuthStatusUI = auth.statusUI(req, res)
    res.render('index', {
        title: req.list,
        description: "Hello to board",
        AuthStatusUI: AuthStatusUI
    });
});

router.get('/board', (req, res, next) => {
    var AuthStatusUI = auth.statusUI(req, res);
    res.render('board', {
        title: req.list,
        AuthStatusUI: AuthStatusUI
    })

})
router.get('/create', (req, res, next) => {
    var AuthStatusUI = auth.statusUI(req, res);
    if (!auth.IsOwner(req, res)) {
        res.redirect('/');
        return false;
    }
    res.render('create', {
        title: req.list,
        AuthStatusUI: AuthStatusUI
    });
});

router.post('/create_process', (req, res, next) => {
    var post = req.body;
    var title = post.new_title;
    var description = post.new_description;
    if (!auth.IsOwner(req, res)) {
        res.redirect('/');
        return false;
    }
    fs.writeFile(`data/${title}`, description, "utf8", (err) => {
        if (err) throw err;
        res.redirect(`data/${title}`);
    })
});

router.get('/data/:pageId', (req, res, next) => {
    var id = req.params.pageId;
    var AuthStatusUI = auth.statusUI(req, res);
    fs.readFile(`data/${id}`, 'utf-8', (err, new_description) => {
        res.render('data', {
            title: req.list,
            description: new_description,
            update: id,
            delete_: id,
            AuthStatusUI: AuthStatusUI

        })
    })
})
router.get('/update/:pageId', (req, res, next) => {
    var AuthStatusUI = auth.statusUI(req, res);
    if (!auth.IsOwner(req, res)) {
        res.redirect('/');
        return false;
    }

    res.render('update', {
        title: req.list,
        update: req.params.pageId,
        AuthStatusUI: AuthStatusUI
    });
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
    fs.rename(`data/${old_title}`, `data/${new_title}`, (err) => {
        fs.writeFile(`data/${new_title}`, description, 'utf8', (err) => {
            res.redirect(`data/${new_title}`);
        })
    })
})
router.post('/delete', (req, res) => {
    console.log('######');
    res.send('<script type="text/javascript">alert("err");</script>');
    if (!auth.IsOwner(req, res)) {
        res.send('<script type="text/javascript">alert("err");</script>');
        res.redirect('/');
        return false;
    }
    var body = req.body;
    var delId = body.delId;
    fs.unlink(`data/${delId}`, (err) => {
        res.redirect('/');
    })
})

module.exports = router;