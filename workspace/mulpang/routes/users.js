var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');

// 회원 가입 화면
router.get('/new', function(req, res, next) {
  res.render('join');
}); 
// 프로필 이미지 업로드
var path = require('path');
var tmp = path.join(__dirname, '..', 'public', 'tmp');
var multer = require('multer');
router.post('/profileUpload', multer({dest: tmp}).single('profile'), function(req, res, next) {
  res.end(req.file.filename);   // 임시 파일명 응답
});
// 회원 가입 요청
router.post('/new', async function(req, res, next) {
  try{
    const email = await model.registMember(req.body);
    res.end(email);
  }catch(err){
    res.json({errors: {message: err.message}});
  }
});
// 간편 로그인
router.post('/simpleLogin', async function(req, res, next) {
  try{
    const user = await model.login(req.body);
    req.session.user = user;
    res.json(user);
  }catch(err){
    res.json({errors: {message: err.message}});
  }
});
// 로그아웃
router.get('/logout', function(req, res, next) {
  res.redirect('/');
});
// 로그인 화면
router.get('/login', function(req, res, next) {
  res.render('login');
});
// 로그인
router.post('/login', async function(req, res, next) {
  res.redirect('/');
});
// 마이 페이지
router.get('/', async function(req, res, next) {
  res.render('mypage');
});
// 회원 정보 수정
router.put('/', async function(req, res, next) {
  res.end('success');
});
// 구매 후기 등록
router.post('/epilogue', async function(req, res, next) {
  res.end('success');
});

module.exports = router;
