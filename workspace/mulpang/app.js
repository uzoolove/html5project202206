var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var nocache = require('nocache');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/today', function(req, res, next){
  // 미들웨어 만드는 방법
  // 1. req, res, next를 매개변수로 정의
  // 2. 기능 구현
  // 3-1. 클라이언트에 응답(res.json(), res.end(), res.render(), res.redirect()...)
  // 3-2. 다음 미들웨어를 호출(next())
  console.log('1 req.query', req.query);
  console.log('1 req.body', req.body);
  console.log('1 req.cookies', req.cookies);
  console.log('1 req.session', req.session);
  console.log(req.headers);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// "/couponQuantity"로 시작하지 않는 url에 세션 사용
app.use(/^((?!\/couponQuantity).)*$/, session({
  cookie: {maxAge: 1000*60*30},// 30분
  secret: 'some seed text',
  rolling: true,  // 매 요청마다 세션 갱신
  resave: false,   // 세션이 수정되지 않으면 서버에 다시 저장하지 않음
  saveUninitialized: false  // 세션에 아무 값도 지정되지 않으면 클라이언트에 전송안함
}), function(req, res, next){
  // ejs 렌더링에 사용할 변수 지정
  res.locals.user = req.session.user;
  next();
});



app.use('/today', function(req, res, next){
  // 미들웨어 만드는 방법
  // 1. req, res, next를 매개변수로 정의
  // 2. 기능 구현
  // 3-1. 클라이언트에 응답(res.json(), res.end(), res.render(), res.redirect()...)
  // 3-2. 다음 미들웨어를 호출(next())
  console.log('2 req.query', req.query);
  console.log('2 req.body', req.body);
  console.log('2 req.cookies', req.cookies);
  console.log('2 req.session', req.session);
  next();
});

app.use(nocache());
app.use(logger('dev'));

app.use('/users', usersRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, req.url + ' Not Found!'));
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  if(req.xhr){
    res.json({errors: err});
  }else{
    next(err);
  } 
});

// error handler
app.use(function(err, req, res, next) {
  // console.error(err.stack);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
