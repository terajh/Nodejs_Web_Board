var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var fs = require('fs');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// jade 엔진을 사용한다고 정의

app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
// 정적인 파일을 pubic 에 놓는다고 정의
app.get('*', function(req, res, next) {
    fs.readdir('./data', function(error, filelist) {
        req.list = filelist;
        next();
    });
}); // filelist를 가져오는 함수, filelist 변수를 초기화한다고 생각하자.


app.use(session({
    secret: 'asdfasdfasdf@#asdfa',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

var passport = require('./lib/passport.js')(app); // refactoring

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
var authRouter = require('./routes/auth.js')(passport);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.listen(3000);


module.exports = app;


//pm2 start app.js --watch --ignore-watch="data/* sessions/*"  --no-daemon