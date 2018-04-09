$(document).ready(function () {
    $("#loginForm").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            url: '/login',
            type: 'POST',
            data: $("#loginForm").serialize(),
            dataType: "json",
            success: function (data) {
                window.location.href = "/";
            },
            error:function (data) {
                showError(data.responseJSON.message||'出错了')
            }
        });
    });
})

function showError(msg) {
    var errorText = '<b>' + msg + '</b>'
    $('#errortip').css('display', 'block');
    console.log(errorText)
    $('#errortip').html(errorText);
}

function hideError() {
    $('#errortip').css('display', 'none');
    $('#errortip').html('')
}

