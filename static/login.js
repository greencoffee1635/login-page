function id_check() {
    let id = $("#register-id").val();
    let data = {
        id_check: id
    };

    $.ajax({
        type: "POST",
        url: "/api/register/id_check",
        data: data,
        success: function(response){
            alert(response['message']);

            if(response['is-available'] === true){
                $("#register-id").addClass('id-ok')
            }
            else{
                $("#register-id").removeClass('id-ok')
            }

        }
    })
}

function register() {

    // id, pw, nick 받아오는 부분.
    let id = $('#register-id').val();
    let pw = $('#register-pw').val();
    let pw_confirm = $('#register-pw-confirm').val();
    let nick = $('#register-nick').val()

    //id, pw 중복확인 체크 // 비밀번호 일치여부 확인
    if(!id){
        alert('아이디를 입력해주세요.')
        return
    }
    if($('#register-id').hasClass('id-ok') !== true){
        alert("아이디 중복확인을 해주세요")
        return
    }
    if(!nick){
        alert('닉네임을 입력해주세요.')
        return
    }
    if(!pw){
        alert('비밀번호를 입력해주세요.')
        return
    }
    if(pw !== pw_confirm){
        alert("비밀번호가 일치하지 않습니다.");
        return
    }

    // 가져온 값들을 하나의 데이터로 모음.
    let data = {
        user_id: id,
        user_pw: pw,
        user_nick: nick
    };
// 비밀번호 일치여부 확인
// 서버로 ajax 통신
        $.ajax({
            type: "POST",
            url: "/api/register",
            data: data,
            success: function(response) {
                alert(response['message']);
                window.location.reload(); //회원가입 확인 누르면 새로고침(로그인페이지로)
            }
        })

}

function login() {
    let id = $("#login-id").val();
    let pw = $("#login-pw").val();

    let data = {
        user_id: id,
        user_pw: pw
    }

    $.ajax({
        type: "POST",
        url: "/api/login",
        data: data,
        success: function(response){
            alert(response['message']);
            $.cookie('freepass', response['token']);
            window.location.replace('/'); //로그인 누르면 홈으로
        }
    })
}

function toggleForm() {
    $("#login").toggleClass("hide");
    $("#register").toggleClass("hide");
}

$(document).ready(function(){
    $("#login-register-btn").on('click', toggleForm)
    $("#register-cancel-btn").on('click', toggleForm)
    $("#login-btn").on('click', login)
    $("#register-btn").on('click', register)
    $("#register-id-check-btn").on('click', id_check)
    $("#register-id").on('change',function() {
        $("#register-id").removeClass('id-ok')
    })
})