module.exports = function(app) {
    // 세션 기본 값을 설정하는 일종의 초기화 함수
    var db = require('./db.js');
    var flash = require('connect-flash');
    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;
    // import passport modules & Strategy modules
    var authData = {
        email: 'terajh@gmail.com',
        password: '123123',
        nickname: 'terajoo'
    }
    app.use(passport.initialize());
    app.use(passport.session());
    // passport 는 내부적으로 session 을 쓰겟다.
    app.use(flash());
    app.get('/flash', function(req, res) {
        // Set a flash message by passing the key, followed by the value, to req.flash().
        req.flash('msg', 'Wrong login');
        // info 라는 것에 두번째인자를 기록
    });

    app.get('/flash-display', function(req, res) {
        // Get an array of flash messages by passing the key to req.flash()
        var fmsg = req.flash();
        res.render('index', { messages: req.flash('info') });
    });

    passport.serializeUser(function(user, done) {
        done(null, user.email);
        // 로그인 성공시 세션스토어에 저장하겟다고 선언하는 것
    });
    // 로그인에 성공했을 때 해당 정보를 세션의 passport에 저장
    // 하는 역할을 한다.

    passport.deserializeUser(function(id, done) {
        var sql = 'SELECT * FROM users WHERE email=?';
        db.query(sql, [id], (error, results) => {
                if (error) throw error;
                if (!results[0]) return done(error, results[0]);
                return done(null, results[0]);
            })
            // authData가 req의 user 에 전달되도록 
            // 약속되어있다.
    });
    // 페이지에 리로드 할 때마다 로그인했는지 세션값을 확인하는
    // 역할을 한다.

    passport.use(new LocalStrategy(
        function(username, password, done) {
            // if (username === authData.email) {
            //     if (password === authData.password) {
            //         return done(null, authData);
            //     } else {
            //         return done(null, false, { message: 'Incorrect password' });
            //     }
            // } else {
            //     return done(null, false, { message: 'Incorrect username' });
            // }
            var sql = 'SELECT * FROM users WHERE email=?';
            console.log(1);
            db.query(sql, [username], (error, results) => {
                if (error) throw error;
                console.log(2);
                if (!results[0]) {
                    console.log(3);
                    return done(null, false, { message: 'Incorrect username' });
                } else {
                    if (password === results[0].password) {
                        console.log(2);
                        return done(null, results[0]);
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                }
            })
        }
    ));
    return passport;
}