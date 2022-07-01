var express = require('express');
var router = express.Router();
const model = require('../model/mulpangDao');
const MyUtil = require('../utils/myutil');
const checklogin = require('../middleware/checklogin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/today');
});

// 오늘 메뉴
router.get('/today', async function(req, res, next) {
  if(req.query.page){
    req.query.page = parseInt(req.query.page);
  }else{
    req.query.page = 1;
    if(req.query.date){ req.url += '&page=1'; } else { req.url += '?page=1';}
  }
  var list = await model.couponList(req.query);
  list.page = {};
  if(req.query.page > 1){
    list.page.pre = req.url.replace('page=' + req.query.page
                                    , 'page=' + (req.query.page-1));
  }
  if(req.query.page < list.totalPage){
    list.page.next = req.url.replace('page=' + req.query.page
                                    , 'page=' + (req.query.page+1));
  }  
  res.render('today', {list: list, query: req.query, options:MyUtil.generateOptions});
});

// 쿠폰 상세조회
router.get('/coupons/:_id', async function(req, res, next) {
  var io = req.app.get('io');
  const coupon = await model.couponDetail(req.params._id, io);
  res.render('detail', {coupon: coupon, toStar: MyUtil.toStar});
});

// 구매 화면
router.get('/purchases/:_id', checklogin, async function(req, res, next) {
  // var user = req.session.user;
  // if(user){
    const coupon = await model.buyCouponForm(req.params._id);
    res.render('buy', {coupon});
  // }else{
  //   req.session.backurl = req.originalUrl;
  //   res.redirect('/users/login');
  // }
});

// 구매 하기
router.post('/purchase', checklogin, async function(req, res, next) {
  try{
    // var user = req.session.user;
    // if(user){
      req.body.email = req.session.user._id;
      const purchaseId = await model.buyCoupon(req.body);
      res.end(String(purchaseId));
    // }else{
    //   res.json({errors: {message: '로그인 후 이용하세요.'}});
    // }    
  }catch(err){
    res.json({errors: {message: err.message}});
  }  
});

// 근처 메뉴
router.get('/location', async function(req, res, next){
  var list = await model.couponList();
  res.render('location', {list});
});
// 추천 메뉴
router.get('/best', function(req, res, next){
  res.render('best');
});
// top5 쿠폰 조회
router.get('/topCoupon', async function(req, res, next){
  var list = await model.topCoupon(req.query.condition);
  res.json(list);
});
// 모두 메뉴
router.get('/all', async function(req, res, next){
  var list = await model.couponList(req.query);
  res.render('all', {list, query: req.query, options: MyUtil.generateOptions});
});
// 쿠폰 남은 수량 조회
router.get('/couponQuantity', async function(req, res, next){
  var list = await model.couponQuantity(req.query.couponIdList.split(','));
  res.contentType('text/event-stream');  
  res.write(`data: ${JSON.stringify(list)}\n`);
  res.write(`retry: ${1000*10}\n`);
  res.end('\n');
});

router.get('/:page.html', function(req, res, next) {
  // /today.html -> today.ejs
  res.render(req.params.page, { title: 'Mulpang' });
});


module.exports = router;
