var createError = require('http-errors');

function getStatus(code){
  var statusCode;
  switch(code){
    case 1000: 
      statusCode = 500; // internal server errer
       break;
    case 1001: 
      statusCode = 401; // Unauthorized
      break;
    case 1002:
      statusCode = 401;
      break;
    case 1003: 
      statusCode = 409; // Conflict
      break;
    case 1004: 
      statusCode = 401;
      break;
  }
  return statusCode;
}

function getMessage(code){
  var message = '';
  switch(code){
    case 1000: 
      message = '작업 처리에 실패했습니다. 잠시후 다시 이용해 주시기 바랍니다.';
      break;
    case 1001: 
      message = '아이디와 비밀번호를 확인하시기 바랍니다.';
      break;
    case 1002:
     message = '이전 비밀번호가 맞지 않습니다.';
     break;
    case 1003: 
      message = '이미 등록된 이메일입니다.';
      break;
    case 1004: 
      message = '로그인이 필요한 서비스입니다.'
      break;
  }
  return message;
}

function getError(code){
  var error = createError(getStatus(code), getMessage(code));
  return error;
}

const MyError = {
  FAIL: getError(1000),
  LOGIN_FAIL: getError(1001),
  PASSWORD_INCRRECT: getError(1002),
  USER_DUPLICATE: getError(1003),
  LOGIN_NEED: getError(1004),
};

module.exports = MyError;