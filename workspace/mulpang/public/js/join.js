$(function(){	
	// TODO 프로필 이미지 선택 시(common.js의 common.upload.profileImage 함수를 호출한다.)
	
	
	// TODO 회원 가입 버튼 클릭 이벤트
	
});

// 회원 가입
async function registMember(event){
  event.preventDefault(); // 브라우저의 기본 동작(submit) 취소
	if($('#password').val() != $('#password2').val()){
		alert('비밀번호와 비밀번호 확인이 맞지 않습니다.');
	}else{
		// 회원 가입을 요청한다.
		var result = await $.post('/users/new', $(this).serialize());

    if(result.errors){
      alert(result.errors.message);
    }else{
      // TODO 가입 결과 출력

    }
	}
}
