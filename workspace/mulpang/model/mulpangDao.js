var util = require('util');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var MyUtil = require('../utils/myutil');

// DB 접속
var db;
const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
  await client.connect();
  db = client.db('mulpang');
  db.member = db.collection('member');
  db.shop = db.collection('shop');
  db.coupon = db.collection('coupon');
  db.purchase = db.collection('purchase');
  db.epilogue = db.collection('epilogue');
  return 'DB 접속 완료.';
}

main()
  .then(console.info)
  .catch(console.error);

// 쿠폰 목록조회
module.exports.couponList = async function(qs){
  qs = qs || {};
	// 검색 조건
	var query = {};
	// 1. 판매 시작일이 지난 쿠폰, 구매 가능 쿠폰(기본 검색조건)	
  var now = moment().format('YYYY-MM-DD');
  query['saleDate.start'] = {$lte: now};
  query['saleDate.finish'] = {$gte: now};
	// 2. 전체/구매가능/지난쿠폰
  switch(qs.date){
    case 'all':
      delete query['saleDate.finish'];
      break;
    case 'past':
      query['saleDate.finish'] = {$lt: now};
      break;
  }
	// 3. 지역명
  if(qs.location){
    query['region'] = qs.location;
  }
	// 4. 검색어	
  var keyword = qs.keyword;
  if(keyword && keyword.trim() != ''){
    var regExp = new RegExp(keyword, 'i');  // 정규표현식
    query['$or'] = [{couponName: regExp}, {desc: regExp}];
  }
	// 정렬 옵션
	var orderBy = {};
	// 1. 사용자 지정 정렬 옵션	
  var orderCondition = qs.order;
  if(orderCondition){
    orderBy[orderCondition] = -1; // 내림차순
  }
	// 2. 판매 시작일 내림차순(최근 쿠폰)	
  orderBy['saleDate.start'] = -1;
	// 3. 판매 종료일 오름차순(종료 임박 쿠폰)
  orderBy['saleDate.finish'] = 1;

	// 출력할 속성 목록
	var fields = {
		couponName: 1,
		image: 1,
		desc: 1,
		primeCost: 1,
		price: 1,
		useDate: 1,
		quantity: 1,
		buyQuantity: 1,
		saleDate: 1,
		position: 1
	};
	
	// TODO 쿠폰 목록을 조회한다.
	var count = 0;
  var offset = 0;
  if(qs.page){
    count = 5;
    offset = (qs.page - 1) * count;
  }
  
  const result = await db.coupon.find(query).project(fields).sort(orderBy).skip(offset).limit(count).toArray();
  const totalCount = await db.coupon.countDocuments(query);
  result.totalPage = Math.floor((totalCount+count-1)/count);
  console.log(result.length + '건 조회됨.');
  return result;
};

// 쿠폰 상세 조회
module.exports.couponDetail = async function(_id, io){
	// coupon, shop, epilogue 조인
	var coupon = await db.coupon.aggregate([{
    $match: {
      _id: ObjectId(_id)
    }
  }, {
    // shop 조인
    $lookup: {
      from: 'shop', // 조인할 컬렉션
      localField: 'shopId', // coupon.shopId
      foreignField: '_id',  // shop._id
      as: 'shop'  // shop이라는 속성으로 추가
    }
  }, {
    // shop 조인 결과를(배열) 개별 속성으로 변환
    $unwind: '$shop' 
  }, {
    // epilogue 조인
    $lookup: {
      from: 'epilogue', // 조인할 컬렉션
      localField: '_id', //  coupon._id
      foreignField: 'couponId',  // epilogue.couponId
      as: 'epilogueList'  // epilogueList라는 속성으로 추가
    }
  }]).next();
  // console.log(coupon);

	// 뷰 카운트를 하나 증가시킨다.
	await db.coupon.updateOne({_id: coupon._id}, {$inc: {viewCount: 1}});
	// 웹소켓으로 수정된 조회수 top5를 전송한다.
	io.emit('top5', await topCoupon('viewCount'));
  return coupon;
};

// 구매 화면에 보여줄 쿠폰 정보 조회
module.exports.buyCouponForm = async function(_id){
	var fields = {
		couponName: 1,
    price: 1,
    quantity: 1,
    buyQuantity: 1,
    'image.detail': 1
	};
	// TODO 쿠폰 정보를 조회한다.
	return await db.coupon.findOne({_id: ObjectId(_id)}, {projection: fields});
};

// 쿠폰 구매
module.exports.buyCoupon = async function(params){
	// 구매 컬렉션에 저장할 형태의 데이터를 만든다.
	var document = {
		couponId: ObjectId(params.couponId),
		email: 'uzoolove@gmail.com',	// 나중에 로그인한 id로 대체
		quantity: parseInt(params.quantity),
		paymentInfo: {
			cardType: params.cardType,
			cardNumber: params.cardNumber,
			cardExpireDate: params.cardExpireYear + params.cardExpireMonth,
			csv: params.csv,
			price: parseInt(params.unitPrice) * parseInt(params.quantity)
		},
		regDate: moment().format('YYYY-MM-DD hh:mm:ss')
	};

  try{
    // TODO 구매 정보를 등록한다.
    const result = await db.purchase.insertOne(document);
    // TODO 쿠폰 구매 건수를 하나 증가시킨다.
    await db.coupon.updateOne({_id: document.couponId}, {$inc: {buyQuantity: document.quantity}});
    return result.insertedId;
  }catch(err){
    console.error(err);
    throw new Error('쿠폰 구매에 실패했습니다. 잠시후 다시 시도하시기 바랍니다.');
  }
};	
	
// 추천 쿠폰 조회
var topCoupon = module.exports.topCoupon = async function(condition){
	var order = {};
  var query = {}; // 검색 조건
  // 1. 판매 시작일이 지난 쿠폰, 구매 가능 쿠폰(기본 검색조건)	
  var now = moment().format('YYYY-MM-DD');
  query['saleDate.start'] = {$lte: now};
  query['saleDate.finish'] = {$gte: now};

  order[condition] = -1;
  var list = await db.coupon.aggregate([
    { $match: query }, 
    { $sort: order }, 
    { $limit: 5 },
    {
      $project: {
        couponName: 1,
        value: '$'+condition
      }
    }
  ]).toArray();
  return list;
};

// 지정한 쿠폰 아이디 목록을 받아서 남은 수량을 넘겨준다.
module.exports.couponQuantity = async function(coupons){
  // coupons = coupons.map(function(couponId){
  //   return ObjectId(couponId);
  // });
  coupons = coupons.map(couponId => ObjectId(couponId));
  var list = await db.coupon.find({_id: {$in: coupons}}
                      , {projection: {couponName: 1, quantity: 1 , buyQuantity: 1}}).toArray();
  return list;
};

// 임시로 저장한 프로필 이미지를 회원 이미지로 변경한다.
function saveImage(tmpFileName, profileImage){
	var tmpDir = path.join(__dirname, '..', 'public', 'tmp');
  var profileDir = path.join(__dirname, '..', 'public', 'image', 'member');
  var org = path.join(tmpDir, tmpFileName);
  var dest = path.join(profileDir, profileImage);
	// TODO 임시 이미지를 member 폴더로 이동시킨다.
	fs.rename(org, dest, function(err){
    if(err) console.error(err);
  });
}

// 회원 가입
module.exports.registMember = async function(params){
	var member = {
    _id: params._id,
    password: params.password,
    profileImage: params._id,
    regDate: moment().format('YYYY-MM-DD hh:mm:ss')
  };

  try{
    var result = await db.member.insertOne(member);
    saveImage(params.tmpFileName, member.profileImage);
    return result.insertedId;
  }catch(err){
    console.error(err);
    if(err.code == 11000){
      throw new Error('이미 등록된 이메일입니다.');
    }else{
      throw new Error('작업 처리에 실패했습니다. 잠시후 다시 시도해 주시기 바랍니다.');
    }
  }
  
};

// 로그인 처리
module.exports.login = async function(params){
	// TODO 지정한 아이디와 비밀번호로 회원 정보를 조회한다.
  try{
    var result = await db.member.findOne({_id: params._id}, {projection: {profileImage: 1, password: 1}});
  }catch(err){
    console.error(err);
    throw new Error('작업 처리에 실패했습니다. 잠시후 다시 시도하시기 바랍니다.');
  }
	
  if(!result){
    throw new Error('아이디가 존재하지 않습니다.');
  }else{
    if(params.password != result.password){
      throw new Error('비밀번호를 확인하세요.');
    }
  }
  delete result.password;
  return result;
};

// 회원 정보 조회
module.exports.getMember = async function(userid){
	
};

// 회원 정보 수정
module.exports.updateMember = async function(userid, params){
	
};

// 쿠폰 후기 등록
module.exports.insertEpilogue = async function(userid, params){
	
};