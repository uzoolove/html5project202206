$(function(){
	setCancelEvent();
	setBuyEvent();
	setPriceEvent();	
});

// 취소 버튼 클릭
function setCancelEvent(){
	$('form button[type=reset]').on('click', function(){
    window.history.back();
  });
}

// 구매 버튼 클릭
function setBuyEvent(){
  $('.detail form').on('submit', async function(e){
    e.preventDefault();
    var body = $(this).serialize();
    var result = await $.post('/purchase', body);
    if(result.errors){
      alert(result.errors.message);
    }else{
      alert('쿠폰 구매가 완료되었습니다.');
      window.location.href = '/';
    }
  });
}

// 구매수량 수정시 결제가격 계산
function setPriceEvent(){
	$('.detail form input[name=quantity]').on('input', function(){
    var price = $(this).val() * $('form input[name=unitPrice]').val();
    $('.detail form output[name=totalPrice]').text(price);
  });
}