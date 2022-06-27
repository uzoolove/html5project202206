const util = require('util');
var db;

// TODO: DB 접속
const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'mulpang';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);

  await db.dropDatabase();

  db.board = db.collection('board');
  
  await task();

  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

async function task(){
  console.log(await todo1(), '\n');
  console.log(await todo2(), '\n');
  // console.log(await todo3(), '\n');
  // console.log(await todo4(), '\n');
  // console.log(await todo5(), '\n');
  // console.log(await todo6(), '\n');
  // console.log(await todo7(), '\n');
  
  // console.log(await todo8(), '\n');
  // console.log(await todo2(), '\n');

  // console.log(await todo9('퍼가요~~~'), '\n');
  // console.log(await todo9('감사합니다.'), '\n');
  // console.log(await todo9('ㅇㄷ'), '\n');
  // console.log(await todo2(), '\n');

  // console.log(await todo10(), '\n');
  // console.log(await todo2(), '\n');
}

// 등록할 게시물
var b1 = {no: 1, name: "admin", title: "[공지] 게시판 사용규칙 안내입니다.", content: "잘 쓰세요."};
var b2 = {no: 2, name: "kim", title: "첫번째 글을 올리네요.", content: "잘 보이나요?"};
var b3 = {no: 3, name: "lee", title: "그렇다면 두번째 글은...", content: "잘 보이겠죠?"};

// insertOne({등록할 문서}), insertMany([{등록할 문서}, {등록할 문서}])
async function todo1(){
  await db.board.insertOne(b1);
  await db.board.insertMany([b2, b3]);
  return 'TODO 1. board 컬렉션에 데이터 등록';
}

// find()
async function todo2(){
  console.log('TODO 2. 모든 board 데이터의 모든 속성 조회');
  return await db.board.find().toArray();
}

// find({검색조건})
async function todo3(){
  console.log('TODO 3. 데이터 조회(kim이 작성한 게시물 조회)');
	
}

// find({검색조건}, {projection: {출력컬럼}})
async function todo4(){
  console.log('TODO 4. 모든 board 데이터의 작성자 속성만 조회(_id 포함)');  
	
}

// find({검색조건}, {projection: {출력컬럼}})
async function todo5(){
  console.log('TODO 5. kim이 작성한 게시물의 제목 조회(_id 미포함)');
  
}

// findOne()
async function todo6(){
  console.log('TODO 6. 첫번째 게시물 조회(1건)');
  
}

// findOne({검색조건})
async function todo7(){
  console.log('TODO 7. 게시물 조회(lee가 작성한 데이터 1건 조회)');
  
}

// updateOne({검색조건}, {수정할 문서})
async function todo8(){
  console.log('TODO 8. 게시물 수정(3번 게시물의 내용 수정)');
	
}

async function todo9(reply){
  console.log('TODO 9. 1번 게시물에 댓글 추가');
	var comment = {
    name: '이영희',
    content: reply
  };
  
}

// deleteOne({검색 조건})
async function todo10(){
  console.log('TODO 10. 2번 게시물 삭제');
	
}

// 1. 모든 쿠폰 목록을 조회한다.
// 2. 쿠폰명, 판매시작일만 출력.
// 3. 판매시작일의 내림차순으로 정렬.
// 4. 한페이지당 5건 일때 2페이지를 조회.
async function todo11(){
  console.log('TODO 11. mulpang DB coupon collection 조회');
  var data = [];
  
  console.log(data.length, '건 조회됨.');
  return data;
}




































