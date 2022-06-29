/*
	1. 지도를 보여주고 현재 위치 찾기
		1.1 구글맵 로딩
		1.2 현재 위치 찾기
		1.3 지도를 현재 위치로 이동	
		1.4 현재 위치에 마커 표시
		1.5 현재 위치의 오차 표시
	2. 지도에 쿠폰 추가
		2.1 지도에 쿠폰 추가
		2.2 지도 범위 내의 쿠폰을 슬라이더에 보여준다.
		2.3 지도의 범위가 변경될 경우 지도안의 쿠폰을 슬라이더에 보여주도록 이벤트 추가
	3. 슬라이드 이벤트 추가
*/

// 1. 지도를 보여주고 현재 위치 찾기
var map;
function initMap(){
  $(function(){
    // 1.1 구글맵 로딩
    
    // 1.2 현재 위치 찾기
    
    function success(position){
      // 1.3 지도를 현재 위치로 이동
      
      // 1.4 현재 위치에 마커 표시
      
      // 1.5 현재 위치의 오차 표시
      
    }

    function fail(err){
      console.error(err);
      /*
      var position = {
        coords: {
          latitude: 37.5017754,
          longitude: 127.0400846,
          accuracy: 200
        }
      };
      success(position);
      */
    }

    // 2. 지도에 쿠폰 추가
    addCouponToMap();
  });
}

var articleList;
var openWindow;
// 2. 지도에 쿠폰 추가
function addCouponToMap(){
	articleList = $('.coupon_list article');
  // 2.1 지도에 쿠폰 추가
  articleList.each(function(){
    
    // 쿠폰 마커 생성 
    
    // 지도 클릭 시 보여줄 정보창 생성
    
    // 마커 클릭 이벤트 추가
    
	});

	// 2.2 지도 범위 내의 쿠폰을 슬라이더에 보여준다.
	function showSlider(){
		
		// 첫번째 쿠폰으로 슬라이더 이동
		
		// 현재 위치를 history에 기록
		
	}

	// 지도 로딩완료 이벤트
	google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
		
		// 2.3 지도의 범위가 변경될 경우 지도안의 쿠폰을 슬라이더에 보여주도록 이벤트 추가
		
		// 3. 슬라이드 이벤트 추가
		
	});
}
	
// 3. 슬라이드 이벤트 추가
function setSlideEvent(){
	var range = $('#location_coupon_control input[type=range]');
	var preBtn = $('#btn_pre_location_coupon');
	var nextBtn = $('#btn_next_location_coupon');
	
	// 슬라이더 값이 변경될 경우의 이벤트 추가(막대기를 드래그 해서 이동 시)
	range.change(function(){
		slide(parseInt(range.val()));
	});
	
	// 이전/이후 버튼의 클릭 이벤트 추가
	preBtn.click(function(){
		if(range.val() > 0){
			slide(parseInt(range.val())-1);
		}
	});
	nextBtn.click(function(){
		if(range.val() <  $('.coupon_list article:visible').size()-1){
			slide(parseInt(range.val())+1);
		}
	});
}

// 지정한 순번의 쿠폰으로 슬라이더 이동
function slide(actNo){
	var visibleArticle = $('.coupon_list article:visible');
	visibleArticle.each(function(i){
		var article = $(this);
		switch(i){
		case actNo-2:
			article.attr('class', 'location_slide_pre_02');
			break;
		case actNo-1:
			article.attr('class', 'location_slide_pre_01');
			break;
		case actNo:
			article.attr('class', 'location_slide_act');
			break;
		case actNo+1:
			article.attr('class', 'location_slide_next_01');
			break;
		case actNo+2:
			article.attr('class', 'location_slide_next_02');
			break;
		default:
			if(i < actNo){
				article.attr('class', 'location_slide_pre_hide');	
			}else{
				article.attr('class', 'location_slide_next_hide');
			}
			break;
		}
	});
	
	var size = visibleArticle.size();	
	$('#location_coupon_control input[type=range]').val(actNo).attr('max', size==0 ? 0 : size-1);
	$('#counter_now').text(size==0 ? 0 : actNo+1);
	$('#counter_all').text(size);
}








