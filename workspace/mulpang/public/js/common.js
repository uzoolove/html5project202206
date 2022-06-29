var common = {
  cart: {},
  upload: {},
  login: {}
};

$(function(){
	common.cart.showCart();
});

// 관심쿠폰을 보여준다.
common.cart.showCart = function(){
  // var cartElement = '<li data-couponid="' + couponId + '"><a href="/coupons/' + couponId + '"><img src="' + coupon.img + '" alt="' + coupon.name + '"></a><button class="cart_close">관심쿠폰 삭제</button></li>';
  

  // TODO 알림메세지 승인시 관심쿠폰 수량 요청 시작
  
};

// 관심쿠폰 삭제 이벤트
common.cart.setRemoveCartEvent = function(){
	$('#cart .cart_close').click(function(){
		var cart = JSON.parse(localStorage.getItem('cart'));
		var couponId = $(this).parent().data('couponid');
		delete cart[couponId];
		localStorage.setItem('cart', JSON.stringify(cart));
		common.cart.showCart();
	});
};

// 관심쿠폰의 남은 수량을 받아서 10개 미만일 경우 알림 메세지를 보여준다.
common.cart.es = null;
common.cart.requestQuantity = function(){
  if(common.cart.es) common.cart.es.close();
  var cart = JSON.parse(localStorage.getItem('cart') || '{}');
  if(Object.keys(cart).length == 0) return;
  
  // SSE 요청 시작
  common.cart.es = new EventSource('/couponQuantity?couponIdList=' + Object.keys(cart));
  common.cart.es.onmessage = function(me){
    var data = JSON.parse(me.data);
    data.forEach(function(coupon){
      var cartCoupon = cart[coupon._id];
      var count = coupon.quantity - coupon.buyQuantity;
      if(count < cartCoupon.noti && count > 0){
        var msg = cartCoupon.name + ' 수량이 ' + count + '개 밖에 남지 않았습니다.';
        common.cart.showNoti({
          tag: coupon._id,
          icon: cartCoupon.img,
          body: msg
        });
        cartCoupon.noti = count;
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    });
  };
};

// 바탕화면 알림 서비스를 보여준다.
common.cart.showNoti = function(noti){	
	
};


// 프로필 이미지를 업로드 한다.
common.upload.profileImage = function(){
	// 파일을 선택한 후에 파일 선택을 취소했을 경우
	if(this.files.length == 0) return;
	
	var progress = $('.form_section > form progress');
	
	// XMLHttpRequest 객체 생성
	var xhr = new XMLHttpRequest();
	
	// 업로드 시작시 발생
	xhr.upload.onloadstart = function(){
		progress.val(0).show();
	};
	
	// 업로드 도중에 계속 발생
	xhr.upload.onprogress = function(e){
		progress.val(e.loaded / e.total);
	};
	
	// 업로드 종료 시 발생
	xhr.upload.onload = function(){
		progress.hide();
	};
	
	// 서버의 응답 완료시 발생
	// 프로필 이미지를 업로드 하면 서버에서는 임시로 만들어지는 파일명을 응답으로 넘겨준다.
	xhr.onload = function(){
		var tmpFileName = xhr.responseText;
		$('.form_section > form')[0].tmpFileName.value = tmpFileName;
		$('.form_section > form img').attr('src', '/tmp/' + tmpFileName);
	};	
	
	// 선택한 프로필 이미지를 서버로 업로드한다.
	var formData = new FormData();
	formData.append('profile', this.files[0]);
	
	xhr.open('post', '/users/profileUpload', true);
	xhr.send(formData);
}


$(function(){
	common.login.setLoginEvent();
});

// 로그인 이벤트 등록
common.login.setLoginEvent = function(){
  $('#simple_login').submit(async function(event){
    event.preventDefault(); // 브라우저의 기본 동작(submit) 취소
    var result = await $.post('/users/simpleLogin', $(this).serialize());

    if(result.errors){
      alert(result.errors.message);
    }else{
      // TODO 로그인 결과 출력
      
    }
  });
};
