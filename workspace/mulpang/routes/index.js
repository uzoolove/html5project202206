var express = require('express');
var router = express.Router();
const model = require('../model/mulpangDao');
const MyUtil = require('../utils/myutil');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/today');
});

// 오늘 메뉴
router.get('/today', async function(req, res, next) {
  const list = await model.couponList();
  res.render('today', {list: list});
});

// 쿠폰 상세조회
router.get('/coupons/:_id', async function(req, res, next) {
  const coupon = await model.couponDetail(req.params._id);
  res.render('detail', {coupon: coupon, toStar: MyUtil.toStar});
});

// 구매 화면
router.get('/purchases/:_id', async function(req, res, next) {
  const coupon = await model.buyCouponForm(req.params._id);
  res.render('buy', {coupon});
});

// 구매 하기
router.post('/purchase', async function(req, res, next) {
  try{
    const purchaseId = await model.buyCoupon(req.body);
    res.end(String(purchaseId));
  }catch(err){
    res.json({errors: {message: err.message}});
  }  
});

router.get('/:page.html', function(req, res, next) {
  // /today.html -> today.ejs
  res.render(req.params.page, { title: 'Mulpang' });
});


module.exports = router;
