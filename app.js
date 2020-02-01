var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
var authRouter = require('./routes/auth.js');
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var fs = require('fs');
var auth = require('./lib/auth.js');

var authData = {
    email: 'terajh@gmail.com',
    password: '123123',
    nickname: 'terajoo'
}
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// jade 엔진을 사용한다고 정의

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
// 세션 기본 값을 설정하는 일종의 초기화 함수
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
// import passport modules & Strategy modules

app.use(passport.initialize());
app.use(passport.session());
// passport 는 내부적으로 session 을 쓰겟다.

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.email);
    // 로그인 성공시 세션스토어에 저장하겟다고 선언하는 것
});
// 로그인에 성공했을 때 해당 정보를 세션의 passport에 저장
// 하는 역할을 한다.

passport.deserializeUser(function(id, done) {
    console.log('deserializeUSer', id);
    done(null, authData);
    // authData가 req의 user 에 전달되도록 
    // 약속되어있다.
});
// 페이지에 리로드 할 때마다 로그인했는지 세션값을 확인하는
// 역할을 한다.

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd'
    },
    function(username, password, done) {
        console.log(1);

        if (username === authData.email) {
            if (password === authData.password) {
                console.log(2);
                return done(null, authData);
            } else {
                console.log(3);
                return done(null, false, { message: 'Incoreect password' });
            }
        } else {
            console.log(4);
            return done(null, false, { message: 'Incoreect username' });
        }
    }
));

app.post('/auth/login_process',
    passport.authenticate('local', { // local 전략을 이용해 인증하겠다는 의미.
        successRedirect: '/', // 성공시
        failureRedirect: '/auth/login' // 실패시
    }));



app.use(compression());

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