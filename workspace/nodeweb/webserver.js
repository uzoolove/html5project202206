const http = require('http');
const fs = require('fs');
const path = require('path');
// const myMime = require('./mimetypes');
const mime = require('mime');

const home = path.join(__dirname, 'design');

var server = http.createServer(function(req, res){
  console.log(req.method, req.url, req.httpVersion);
  // console.log(req.headers);
  var filename = req.url;
  // var mimeType = myMime.getMime(filename);
  var mimeType = mime.getType(filename);

  // 비동기방식
  fs.readFile(path.join(home, filename), function(err, data){
    console.log('2. readFile() 콜백함수.');
    if(err){
      console.error(err);
      res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'});
      res.end('<h1>' + filename + ' 파일을 찾을 수 없습니다.</h1>');
    }else{
      res.writeHead(200, {'Content-Type': mimeType + ';charset=utf-8'});
      res.end(data);
    }
  });

  console.log('1. readFile() 호출 후...');

  // 동기방식
  // try{
  //   var data = fs.readFileSync(path.join(home, filename));
  //   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
  //   res.end(data);
  // }catch(err){
  //   console.error(err);
  //   res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'});
  //   res.end('<h1>' + filename + ' 파일을 찾을 수 없습니다.</h1>');
  // }
  
});
server.listen(1234, function(){
  console.log('HTTP 서버 구동 완료.');
});