var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var compression = require('compression');
var fs = require('fs');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static(path.join(__dirname, 'data')));

/* GET home page. */

router.get('/', function(req, res) {
    // fs.readdir('./data', function(error, filelist) {
    //     //console.log(filelist);
    //     res.render('index', { title: filelist });
    // });
    res.render('index', { title: req.list, description: "Hello to board" });
});
router.get('/create', (req, res, next) => {
    res.render('create', { title: req.list });
});

router.post('/create_process', (req, res, next) => {
    var post = req.body;
    var title = post.new_title;
    var description = post.new_description;
    fs.writeFile(`data/${title}`, description, "utf8", (err) => {
        if (err) throw err;
        res.redirect('/');
    })
});
router.get('/data/:pageId', (req, res, next) => {
    var id = req.params.pageId;
    fs.readFile(`data/${id}`, 'utf-8', (err, new_description) => {
        res.render('index', { title: req.list, description: new_description, update: id })
    })
})
router.get('/update/:pageId', (req, res, next) => {
    res.render('update', { title: req.list, update: req.params.pageId });
})
router.post('/update_process', (req, res, next) => {
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

module.exports = router;