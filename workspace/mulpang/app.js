var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

app.use(logger('dev'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, req.url + ' Not Found!'));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
