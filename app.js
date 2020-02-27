const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression'); // 파일 압축 송수신
const session = require('express-session');
const FileStore = require('session-file-store')(session); // 세션 내부 저장소에 저장



const express = require('express');
const app = express();


app.use(session({
    secret: 'qkrwngus#qkrwngus',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
})); // 세션이용); // app server session 사용

const http = require('http').createServer(app);
const io = require('socket.io');

const httpServer = http.listen(9000,(req,res)=>{
    console.log('socket server : 9000');
}); // socket 서버 열기
const socketServer = io(httpServer);


socketServer.on('connection', (socket) => {
    socket.on('chat message',(msg)=>{
        console.log(socket.handshake.address);
        socketServer.emit('chat message',msg);
    });
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    })
});

httpServer.on('request', (req,res)=>{
    console.log('requests gone');
})

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
app.use(express.static(path.join(__dirname, '/node_modules')));


var passport = require('./lib/passport.js')(app); // refactoring
var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
var authRouter = require('./routes/auth.js')(passport);
var chatRouter = require('./routes/chat.js');


// app.use('/chat',chatRouter);
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/chat',chatRouter);



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






module.exports = app;


//pm2 start app.js --watch --ignore-watch="data/* sessions/*"  --no-daemon
