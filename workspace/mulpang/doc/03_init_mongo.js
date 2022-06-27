var db;

// DB 접속
const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'mulpang';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);

  await db.dropDatabase();
  console.info("mulpang DB 삭제.");

  db.member = db.collection('member');
  db.shop = db.collection('shop');
  db.coupon = db.collection('coupon');
  db.purchase = db.collection('purchase');
  db.epilogue = db.collection('epilogue');
  console.info('DB 초기화 완료.');

  await task();

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

async function task(){
  // 회원 데이터 등록
  await registMember();
  // 업체 데이터 등록
  await registShop();
  // 쿠폰 데이터 등록
  await registCoupon();
  // 후기 데이터 등록
  await registEpilogue();
  // 구매 데이터 등록
  await registPurchase();
  // 쿠폰 조회
  await findCoupon();
}

var now = new Date();
// 1. 회원 데이터 등록
async function registMember(){
	var members = [
		{
			_id: "uzoolove@gmail.com", 
			password: "uzoolove", 
			profileImage: "uzoolove@gmail.com",
			regDate: now
		},
		{
			_id: "seulbinim@gmail.com", 
			password: "seulbinim", 
			profileImage: "seulbinim@gmail.com",
			regDate: now
		},
		{
			_id: "test@test.com", 
			password: "test", 
			profileImage: "test@test.com",
			regDate: now
		}
	];
	
	// 2. 회원 데이터 등록 완료 시 업체 데이터 등록
	await db.member.insertMany(members);
	console.info("1. 회원 등록 완료.");
}

// 업체 데이터 등록
async function registShop(){
	// 업체 아이디 값을 미리 생성한다.
	shopObjId = [];
	for(var i=0; i<5; i++){
		shopObjId[i] = ObjectId();
	}
	var shops = [
		{
			_id: shopObjId[0],
			shopName: "을지로 골뱅이", 
			tel: "02-111-2222", 
			region: "강남",
			address: "서울특별시 강남구 역삼2동 718-1", 
			officeHours: {open: "14:00", close: "24:00"}, 
			homepage: "www.multicampus.co.kr", 
			email: "master@multicampus.co.kr",
			shopDesc: "골뱅이는 역시 을지로 골뱅이. 물냉면도 맛있어요.", 
			dayoff: "매주 일요일", 
			position: {lat: 37.501025, lng: 127.038866},
			directions: "역삼역 1번 출구에서 직진으로 100m 오시면 좌측에 을지로 골뱅이 간판이 보입니다.",
			etc: "기타 정보 없음.",
			couponQuantity: 1,
			image: {interior: {file: "shop_01.jpg", desc: "을지로 골뱅이 외부 모습"}, map: {file: "shop_map_01.png", desc: "을지로 골뱅이 지도"}}
		},
		{
			_id: shopObjId[1],
			shopName: "스타벅스 압구정", 
			tel: "02-222-3333",
			region: "압구정",
			address: "서울특별시 강남구 신사동 639-7", 
			officeHours: {open: "10:00", close: "22:00"}, 
			homepage: "http://www.istarbucks.co.kr", 
			email: "star@naver.com",
			shopDesc: "스타벅스 압구정 지점입니다.", 
			dayoff: "연중 무휴", 
			position: {lat: 37.528085, lng: 127.036479},	
			directions: "압구정역 3번 출구로 나와서 30m 걸어오신 후 첫번째 골목에서 20m 들어가면 간판이 보입니다.",
			etc: "압구정 최고의 스타벅스입니다.",
			couponQuantity: 1,
			image: {interior: {file: "shop_02.jpg", desc: "스타벅스 압구정 전경"}, map: {file: "shop_map_02.png", desc: "스타벅스 압구정 지도"}}
		},
		{
			_id: shopObjId[2],
			shopName: "투썸플레이스 압구정 51K점", 
			tel: "02-444-5555",
			region: "압구정",
			address: "서울특별시 강남구 신사동 602", 
			officeHours: {open: "10:00", close: "22:00"}, 
			homepage: "http://www.twosome.co.kr/main.asp", 
			email: "two@naver.com",
			shopDesc: "스타일리쉬 '소간지' 공간. 매장 곳곳 배우 소지섭의 섬세한 감각이 당신에게 특별한 가치를 선물합니다.", 
			dayoff: "연중 무휴", 
			position: {lat: 37.524207, lng: 127.029446},
			directions: "압구정역 3번 출구에 위치한 CGV 압구정 신관 1층",
			etc: "'투썸 플레이스 by 51K'에는 배우 소지섭이 직접 기획부터 참여하고, 적극적인 아이디어 제안으로 만들어진 51K점 만의 특별한 메뉴가 있습니다.",
			couponQuantity: 1,
			image: {interior: {file: "shop_03.jpg", desc: "투썸 플레이스 압구정 전경"}, map: {file: "shop_map_03.png", desc: "투썸 플레이스 지도"}}
		}	     
	];
	
	// 3. 업체 데이터 등록 완료 시 쿠폰 데이터 등록
	await db.shop.insertMany(shops);
	console.info("2. 업체 등록 완료.");
}

// 쿠폰 데이터 등록
async function registCoupon(){
	// 쿠폰 아이디 값을 미리 생성한다.
	couponObjId = [];
	for(var i=0; i<20; i++){
		couponObjId[i] = ObjectId();
	}
	var shops = await db.shop.find().toArray();

  shopObjId = shops;
  var coupons = [
      {
      _id: couponObjId[15],
      shopId: shopObjId[2]._id, 
      region: "홍대",
      position: {lat: 37.553446, lng: 126.925688},
      couponName: "디저트 마카롱", 
      primeCost: 5500, 
      price: 4700, 
      quantity: 100, 
      saleDate: {start: getDay(-1), finish: getDay(5)}, 
      useDate: {start: getDay(-2), finish: getDay(60)}, 
      image: {main: {file: "coupon_16.jpg", desc: "디저트 마카롱 메인 이미지"}, detail: {file: "coupon_16_detail.jpg", desc: "디저트 마카롱 상세 이미지"}, etc: [{file: "coupon_16_1.jpg", desc: "디저트 마카롱/그린티"}, {file: "coupon_16_2.jpg", desc: "디저트 마카롱/스트로베리"}]}, 
      desc: "바삭하고 쫀득한 초코 마카롱과 망고 마카롱사이에 새콤달콤한 패션망고크림과 상큼한 요거생크림, 신선한 과일을 담아낸 디저트", 
      comment: "한 테이블에 하나만 사용 가능.", 
      buyQuantity: 20, 
      regDate: getDay(-30),
      epilogueCount: 52,
      viewCount: 270,
      satisfactionAvg: 3.678454
      },
    {
      _id: couponObjId[1],
      shopId: shopObjId[1]._id, 
      region: "압구정",
      position: {lat: 37.525656, lng: 127.027464},
      couponName: "커피통 와플", 
      primeCost: 16000, 
      price: 12000, 
      quantity: 200, 
      saleDate: {start: getDay(-1), finish: getDay(20)}, 
      useDate: {start: getDay(3), finish: getDay(33)}, 
      image: {main: {file: "coupon_02.jpg", desc: "와플 메인 이미지"}, detail: {file: "coupon_02_detail.jpg", desc: "와플 상세 이미지"}, etc: [{file: "coupon_02_0.jpg", desc: "추억의 폴라로이드 사진"}, {file: "coupon_02_1.jpg", desc: "라떼아트"}, {file: "coupon_02_2.jpg", desc: "맛있는 쿠키"}, {file: "coupon_02_3.jpg", desc: "팥빙수"}]}, 
      video: {src: "waffle.mp4", poster: "waffle.jpg", desc: "와플 홍보 동영상"},
      desc: "와플과 아이스크림 세트가 12000원", 
      comment: "무제한 사용 가능.", 
      buyQuantity: 29, 
      regDate: getDay(-10),
      epilogueCount: 38,
      viewCount: 45,
      satisfactionAvg: 2.435345
    },
    {
      _id: couponObjId[2],
      shopId: shopObjId[0]._id, 
      region: "강남",
      position: {lat: 37.500727, lng: 127.025199},
      couponName: "고려 삼계탕", 
      primeCost: 13000, 
      price: 10000, 
      quantity: 1000, 
      saleDate: {start: getDay(1), finish: getDay(3)}, 
      useDate: {start: getDay(2), finish: getDay(3)}, 
      image: {main: {file: "coupon_03.jpg", desc: "삼계탕 메인 이미지"}, detail: {file: "coupon_03_detail.jpg", desc: "삼계탕 상세 이미지"}, etc: []}, 
      desc: "더위를 잊기위한 필수 보양식!", 
      comment: "한 테이블에 하나만 사용 가능.", 
      buyQuantity: 38, 
      regDate: getDay(-5),
      epilogueCount: 560,
      viewCount: 23,
      satisfactionAvg: 3.5345435
    },
    {
      _id: couponObjId[3],
      shopId: shopObjId[0]._id, 
      region: "기타",
      position: {lat: 37.348207, lng: 126.688966},
      couponName: "눈물의 해물 파전", 
      primeCost: 11000, 
      price: 9000, 
      quantity: 100, 
      saleDate: {start: getDay(1), finish: getDay(3)}, 
      useDate: {start: getDay(3), finish: getDay(33)}, 
      image: {main: {file: "coupon_04.jpg", desc: "파전 메인 이미지"}, detail: {file: "coupon_04_detail.jpg", desc: "파전 상세 이미지"}, etc: []}, 
      desc: "눈물 없이는 먹을수 없는 해물파전을 단돈 9000원에 모십니다.", 
      comment: "한 테이블에 하나만 사용 가능. 타 쿠폰과 중복 사용 불가", 
      buyQuantity: 27, 
      regDate: getDay(-3),
      epilogueCount: 17,
      viewCount: 44,
      satisfactionAvg: 2.9896776
    },
    {
      _id: couponObjId[4],
      shopId: shopObjId[0]._id, 
      region: "강남",
      position: {lat: 37.501366, lng: 127.027119},
      couponName: "자연산 활어회", 
      primeCost: 52000, 
      price: 35000, 
      quantity: 30, 
      saleDate: {start: getDay(-30), finish: getDay(-5)}, 
      useDate: {start: getDay(-30), finish: getDay(-1)}, 
      image: {main: {file: "coupon_05.jpg", desc: "활어회 메인 이미지"}, detail: {file: "coupon_05_detail.jpg", desc: "활어회 상세 이미지"}, etc: []}, 
      desc: "직접 잡은 자연산 활어회를 반값에 드립니다.", 
      comment: "한 테이블에 하나만 사용 가능.", 
      buyQuantity: 16, 
      regDate: getDay(-30),
      epilogueCount: 67,
      viewCount: 24,
      satisfactionAvg: 3.123213
    },
    {
      _id: couponObjId[5],
      shopId: shopObjId[0]._id, 
      region: "압구정",
      position: {lat: 37.526004, lng: 127.029710},
      couponName: "그라제 버거", 
      primeCost: 8000, 
      price: 6400, 
      quantity: 500, 
      saleDate: {start: getDay(-5), finish: getDay(5)}, 
      useDate: {start: getDay(1), finish: getDay(3)}, 
      image: {main: {file: "coupon_06.jpg", desc: "그라제 버거 메인 이미지"}, detail: {file: "coupon_06_detail.jpg", desc: "그라제 버거 상세 이미지"}, etc: []}, 
      desc: "수제 햄거버의 명문!!! 그라제 버거. 반값 가격으로 만나보세요.", 
      comment: "한 테이블에 하나만 사용 가능. 런치에만 사용 가능.", 
      buyQuantity: 203, 
      regDate: getDay(-10),
      epilogueCount: 106,
      viewCount: 255,
      satisfactionAvg: 4.56432
    },
    {
      _id: couponObjId[6],
      shopId: shopObjId[1]._id, 
      region: "압구정",
      position: {lat: 37.527431, lng: 127.029401},
      couponName: "베스킨 라빈스", 
      primeCost: 13500, 
      price: 10000, 
      quantity: 299, 
      saleDate: {start: getDay(-5), finish: getDay(2)}, 
      useDate: {start: getDay(4), finish: getDay(30)}, 
      image: {main: {file: "coupon_07.jpg", desc: "베스킨 라빈스 싱글콘"}, detail: {file: "coupon_07_detail.jpg", desc: "베스킨 라빈스 싱글콘 상세 이미지"}, etc: []}, 
      desc: "32가지 아이스크림 중에서 싱글콘 선택이 가능", 
      comment: "할인 쿠폰과 중복 사용 불가능.", 
      buyQuantity: 203, 
      regDate: getDay(-10),
      epilogueCount: 90,
      viewCount: 34,
      satisfactionAvg: 3.5
    },
    {
      _id: couponObjId[0],
      shopId: shopObjId[0]._id, 
      region: "강남",
      position: {lat: 37.501263, lng: 127.028010},
      couponName: "물냉면", 
      primeCost: 8000, 
      price: 6000, 
      quantity: 203, 
      saleDate: {start: getDay(-2), finish: getDay(10)}, 
      useDate: {start: getDay(-2), finish: getDay(30)}, 
      image: {main: {file: "coupon_01.jpg", desc: "물냉면 메인 이미지"}, detail: {file: "coupon_01_detail.jpg", desc: "물냉면 상세 이미지"}, etc: []}, 
      desc: "맛있는 물냉이 6000원. 반값에 제공합니다.", 
      comment: "한 테이블에 하나만 사용 가능.", 
      buyQuantity: 203, 
      regDate: getDay(-3),
      epilogueCount: 7,
      viewCount: 200,
      satisfactionAvg: 3.54354353
    },
    {
      _id: couponObjId[7],
      shopId: shopObjId[0]._id, 
      region: "압구정",
      position: {lat: 37.526559, lng: 127.028029},
      couponName: "병맥주페스티벌", 
      primeCost: 25000, 
      price: 20000, 
      quantity: 45, 
      saleDate: {start: getDay(-15), finish: getDay(3)}, 
      useDate: {start: getDay(10), finish: getDay(20)}, 
      image: {main: {file: "coupon_08.jpg", desc: "수입맥주와 안주세트"}, detail: {file: "coupon_08_detail.jpg", desc: "수입맥주와 안주세트 상세 이미지"}, etc: []}, 
      desc: "회식 2차 장소로 딱!!! 수입맥주 중 아무거나 5병 구매시 1병 추가제공.", 
      comment: "할인 쿠폰과 중복 사용 불가능.", 
      buyQuantity: 0, 
      regDate: getDay(-20),
      epilogueCount: 23,
      viewCount: 21,
      satisfactionAvg: 3.6785
    },
    {
      _id: couponObjId[8],
      shopId: shopObjId[1]._id, 
      region: "홍대",
      position: {lat: 37.553139, lng: 126.923162},
      couponName: "카페라떼", 
      primeCost: 5000, 
      price: 3000, 
      quantity: 20, 
      saleDate: {start: getDay(-8), finish: getDay(-5)}, 
      useDate: {start: getDay(5), finish: getDay(30)}, 
      image: {main: {file: "coupon_09.jpg", desc: "카페라떼"}, detail: {file: "coupon_09_detail.jpg", desc: "카페라떼 상세 이미지"}, etc: []}, 
      desc: "고급원두를 사용한 카페라떼를 저렴한 가격에 제공", 
      comment: "아이스로 주문 시 500원 추가.", 
      buyQuantity: 10, 
      regDate: getDay(-10),
      epilogueCount: 53,
      viewCount: 210,
      satisfactionAvg: 4.87654
    },
    {
      _id: couponObjId[9],
      shopId: shopObjId[0]._id, 
      region: "홍대",
      position: {lat: 37.554482, lng: 126.922077},
      couponName: "일말에 스파게티", 
      primeCost: 15000, 
      price: 9000, 
      quantity: 27, 
      saleDate: {start: getDay(-17), finish: getDay(10)}, 
      useDate: {start: getDay(10), finish: getDay(30)}, 
      image: {main: {file: "coupon_10.jpg", desc: "일말에 스파게티"}, detail: {file: "coupon_10_detail.jpg", desc: "일말에 스파게티 상세 이미지"}, etc: []}, 
      desc: "일말에 스파게티 자유쿠폰", 
      comment: "토마토 또는 크림 스파게티 메뉴만 사용 가능", 
      buyQuantity: 17, 
      regDate: getDay(-20),
      epilogueCount: 45,
      viewCount: 6,
      satisfactionAvg: 3.34532
    },
    {
      _id: couponObjId[10],
      shopId: shopObjId[1]._id, 
      region: "홍대",
      position: {lat: 37.554555, lng: 126.923161},
      couponName: "허브 삼겹살", 
      primeCost: 11000, 
      price: 5500, 
      quantity: 120, 
      saleDate: {start: getDay(-10), finish: getDay(4)}, 
      useDate: {start: getDay(7), finish: getDay(10)}, 
      image: {main: {file: "coupon_11.jpg", desc: "허브 삼겹살"}, detail: {file: "coupon_11_detail.jpg", desc: "허브 삼겹살 상세 이미지"}, etc: []}, 
      desc: "홍대 직장인의 회식 장소. 허브 삼겹살 반값쿠폰.", 
      comment: "1인당 10매까지만 구입가능", 
      buyQuantity: 30, 
      regDate: getDay(-10),
      epilogueCount: 3,
      viewCount: 21,
      satisfactionAvg: 4.23421
    },
    {
      _id: couponObjId[11],
      shopId: shopObjId[0]._id, 
      region: "압구정",
      position: {lat: 37.525357, lng: 127.027052},
      couponName: "널부 쭈꾸미", 
      primeCost: 28000, 
      price: 15000, 
      quantity: 75, 
      saleDate: {start: getDay(-8), finish: getDay(4)}, 
      useDate: {start: getDay(5), finish: getDay(15)}, 
      image: {main: {file: "coupon_12.jpg", desc: "널부 쭈꾸미"}, detail: {file: "coupon_12_detail.jpg", desc: "널부 쭈꾸미 상세 이미지"}, etc: []}, 
      desc: "널부에서 매콤한 쭈꾸미 볶음을 저렴한 가격에 구입할 수 있는 절호의 찬스", 
      comment: "점심시간(12시부터 1시까지)에는 사용 불가능", 
      buyQuantity: 65, 
      regDate: getDay(-10),
      epilogueCount: 27,
      viewCount: 12,
      satisfactionAvg: 3.43522
    },
    {
      _id: couponObjId[12],
      shopId: shopObjId[1]._id, 
      region: "신촌",
      position: {lat: 37.556195, lng: 126.938345},
      couponName: "소울 감자탕", 
      primeCost: 35000, 
      price: 20000, 
      quantity: 50, 
      saleDate: {start: getDay(-18), finish: getDay(3)}, 
      useDate: {start: getDay(15), finish: getDay(30)}, 
      image: {main: {file: "coupon_13.jpg", desc: "소울 감자탕"}, detail: {file: "coupon_13_detail.jpg", desc: "소울 감자탕 상세 이미지"}, etc: []}, 
      desc: "감자탕의 전설. 이제 소울에서 만날 수 있습니다. 소중한 친구와 소울 감자탕에서 정겨운 시간을 보내시기 바랍니다. 구매해 주셔서 감사합니다.", 
      comment: "1테이블 1매만 사용 가능", 
      buyQuantity: 50, 
      regDate: getDay(-20),
      epilogueCount: 6,
      viewCount: 264,
      satisfactionAvg: 3.45645
    },
    {
      _id: couponObjId[13],
      shopId: shopObjId[0]._id, 
      region: "신촌",
      position: {lat: 37.556713, lng: 126.951756},
      couponName: "돌판 오리고기", 
      primeCost: 55000, 
      price: 30000, 
      quantity: 80, 
      saleDate: {start: getDay(-11), finish: getDay(2)}, 
      useDate: {start: getDay(8), finish: getDay(15)}, 
      image: {main: {file: "coupon_14.jpg", desc: "돌판 오리고기"}, detail: {file: "coupon_14_detail.jpg", desc: "돌판 오리고기 상세이미지"}, etc: []}, 
      desc: "오리고기의 명문. 회식의 필수코스. 돌판 오리고기. 돌판 오리고기에서는 국내산만을 취급합니다.", 
      comment: "토요일 및 공휴일 사용 불가", 
      buyQuantity: 20, 
      regDate: getDay(-13),
      epilogueCount: 4,
      viewCount: 16,
      satisfactionAvg: 1.34532
    },
    {
      _id: couponObjId[14],
      shopId: shopObjId[1]._id, 
      region: "압구정",
      position: {lat: 37.526334, lng: 127.029656},
      couponName: "정로곱창", 
      primeCost: 38000, 
      price: 20000, 
      quantity: 37, 
      saleDate: {start: getDay(-10), finish: getDay(10)}, 
      useDate: {start: getDay(8), finish: getDay(10)}, 
      image: {main: {file: "coupon_15.jpg", desc: "정로 곱창"}, detail: {file: "coupon_15_detail.jpg", desc: "정로곱창 상세이미지"}, etc: []}, 
      desc: "쫄깃쫄깃 고소, 달콤, 매콤, 고소한 정로 곱창. 곱창의 품격을 느낄 수 있는 정로 곱창으로 오세요.", 
      comment: "가족단위 방문시 음료수 1병 무료 서비스", 
      buyQuantity: 23, 
      regDate: getDay(-10),
      epilogueCount: 5,
      viewCount: 198,
      satisfactionAvg: 4.56745
    }
  ];
       		
  // 4. 쿠폰 데이터 등록 완료 시 후기 데이터 등록
  await db.coupon.insertMany(coupons);
  console.info("3. 쿠폰 등록 완료.");
}

// 후기 데이터 등록
async function registEpilogue(){
	// 업체 아이디 값을 미리 생성한다.
	epilogueId = [];
	for(var i=0; i<7; i++){
		epilogueId[i] = ObjectId();
	}
	var epilogues = [
		{
			_id: epilogueId[0],
			couponId: couponObjId[0],
			writer: "uzoolove@gmail.com",
			satisfaction: 4.5,
			content: "치맥 괜찮아요. 하지만 물냉면은 비추...",			
			regDate: getDay(-1)			
		},
		{
			_id: epilogueId[1],
			couponId: couponObjId[0],
			writer: "uzoolove@gmail.com",
			satisfaction: 5,
			content: "치맥은 역시 을지로 골뱅이가 최고.",
			regDate: getDay(-1)
		},
		{
			_id: epilogueId[2],
			couponId: couponObjId[1],
			writer: "uzoolove@gmail.com",
			satisfaction: 5,
			content: "와플 짱!!! 강추해요.",
			regDate: getDay(-8)			
		},
		{
			_id: epilogueId[3],
			couponId: couponObjId[1],
			writer: "test@test.com",
			satisfaction: 3.5,
			content: "벌써 두번째 구매인데 와플이 맛있어요.",
			regDate: getDay(-20)		
		},
		{
			_id: epilogueId[4],
			couponId: couponObjId[15],
			writer: "seulbinim@gmail.com",
			satisfaction: 5,
			content: "소지섭 봤어요.",
			regDate: getDay(-4)		
		},
		{
			_id: epilogueId[5],
			couponId: couponObjId[15],
			writer: "test@test.com",
			satisfaction: 5,
			content: "그린티보다는 스트로베리가 더 맛있어요.",
			regDate: getDay(-3)
		},
		{
			_id: epilogueId[6],
			couponId: couponObjId[15],
			writer: "uzoolove@gmail.com",
			satisfaction: 4.5,
			content: "최고입니다.",
			regDate: getDay(-1)
		}		
	];
	
	// 5. 후기 데이터 등록 완료 시 구매 데이터 등록
	await db.epilogue.insertMany(epilogues);
	console.info("4. 후기 등록 완료.");	
}

// 구매 데이터 등록
async function registPurchase(){
	var purchases = [
		{
			couponId: couponObjId[0], 
			email: "uzoolove@gmail.com", 
			quantity: 1, 
			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireDate: "209912", csv: "567", price: "6000"},
			epilogueId: epilogueId[0],
			regDate: getTime(-2, 50000)
		},
		{
			couponId: couponObjId[1], 
			email: "uzoolove@gmail.com", 
			quantity: 10, 
			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireDate: "209912", csv: "567", price: "120000"},
			regDate: getTime(-7, 70000)
		},
		{
			couponId: couponObjId[1], 
			email: "test@test.com", 
			quantity: 2, 
			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireDate: "209912", csv: "567", price: "24000"},
			epilogueId: epilogueId[1],
			regDate: getTime(-3, 60000)
		},
		{
			couponId: couponObjId[2], 
			email: "test@test.com", 
			quantity: 1, 
			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireDate: "209912", csv: "567", price: "10000"},
			regDate: getTime(-10, 50000)
		},
		{
			couponId: couponObjId[2], 
			email: "aceppin@paran.com", 
			quantity: 1, 
			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireDate: "209912", csv: "567", price: "10000"},
			epilogueId: epilogueId[2],
			regDate: getTime(-10, 70000)
		},
		{
			couponId: couponObjId[2], 
			email: "seulbinim@gmail.com", 
			quantity: 1, 
			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireDate: "209912", csv: "567", price: "10000"},
			epilogueId: epilogueId[3],
			regDate: getTime(-3, 60000)
		},
		{
			couponId: couponObjId[15], 
			email: "seulbinim@gmail.com", 
			quantity: 1, 
			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireDate: "209912", csv: "567", price: "4700"},
			epilogueId: epilogueId[4],
			regDate: getTime(-4, 20000)
		},
		{
			couponId: couponObjId[15], 
			email: "test@test.com", 
			quantity: 2, 
			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireDate: "209912", csv: "567", price: "9400"},
			epilogueId: epilogueId[5],
			regDate: getTime(-3, 30000)
		},
		{
			couponId: couponObjId[15], 
			email: "uzoolove@gmail.com", 
			quantity: 5, 
			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireDate: "209912", csv: "567", price: "23500"},
			epilogueId: epilogueId[6],
 			regDate: getTime(-4, 40000)
		}
	];
	
	// 6. 구매 데이터 등록 완료 시 등록한 쿠폰 목록을 확인한다.
	await db.purchase.insertMany(purchases);
	console.info("5. 구매 등록 완료.");  	
}

var moment = require('moment');
function getDay(day){
	return moment().add(day, 'days').format('YYYY-MM-DD');
}
function getTime(day, time){
	return moment().add(day, 'days').add(time, 'seconds').format('YYYY-MM-DD hh:mm:ss');
}

// 모든 쿠폰명을 출력한다.
async function findCoupon(){
	var data = await db.coupon.find({}, {projection: {_id: 0, couponName: 1}}).toArray();
  console.info("6. 쿠폰 " + data.length + "건 조회됨.");
  console.info(data);  
}
