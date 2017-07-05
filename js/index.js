var invite_code= getUrlParam('invite_code')
var origin_request = document.location.origin
var inviteUrl = origin_request + '/api/v1/user_registrations'
var sendCodeUrl =  origin_request + '/api/v1/user_registrations/send_sms_code'

$(function () {
    var name = $('.name-input')
    var phone = $('.phone-input')
    var codeInput = $('.code-input')
    var inviteBtn = $('.invite-btn')
    var closeBtn = $('.closeBtn')
    var fixBox = $('.fix-box')
    var hintMessage = $('.hintMessage')
    var verificationCode = $('.verification-code')
    var showCodeHint = $('.showCodeHint')
    var time = null
    var CODE_MSG_INIT = '发送验证码'

    inviteBtn.on('click', function () {
        var phoneValue = phone.val()
        var nameValue = name.val()
        var codeValue = codeInput.val()

        if(inviteBtn.hasClass('disable-btn')){
            return
        }

        if(!nameValue){
            fixBox.css({display: 'block'})
            hintMessage.text('请输入真实姓名')
            return
        }

        if(!phoneValue && !/\d{13}/.test(phoneValue)){
            fixBox.css({display: 'block'})
            hintMessage.text('请输入有效电话号码')
            return
        }

        if(!codeValue){
            fixBox.css({display: 'block'})
            hintMessage.text('请输入验证码')
            return
        }
        submitAjax(inviteUrl, { name: nameValue, phone_num: phoneValue, register_sms_code: codeValue, invite_code: invite_code }, 'invite')
    })
    
    closeBtn.on('click', function () {
        fixBox.css({display: 'none'})
    })
    
    verificationCode.on('click', function () {
        var phoneValue = phone.val()
        if(!phoneValue && !/\d{13}/.test(phoneValue)){
            fixBox.css({display: 'block'})
            hintMessage.text('请输入有效电话号码')
            return
        }

        showCodeHint.text('验证码已发送')
        showCodeHint.css({display: 'inline-block'})

        setTimeout(function () {
            showCodeHint.css({display: 'none'})
        }, 1500)

        if (time) {
            return
        }
        var code_msg_num = 60
        time = setInterval(function(){
            if (code_msg_num <= 1) {
                clearInterval(time)
                code_msg_num = 60
                time = null
                verificationCode.text(CODE_MSG_INIT)
                return
            }
            --code_msg_num
            verificationCode.text(code_msg_num + '秒')
        }, 1000)
        submitAjax(sendCodeUrl, { phone_num: phoneValue })
    })

    function submitAjax(url, params, type){
        $.ajax({
            type: 'post',
            url: url,
            data : params || {},
            ContentType: 'application/json',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    'Accept' , 'application/json'
                )
            },
            success: function(data){
                if(type == 'invite'){
                    fixBox.css({display: 'block'})
                    hintMessage.text('申请成功')
                    inviteBtn.addClass('disable-btn')
                }
            },
            error: function(xhr){
                var errorMessage = ''
                if(xhr.status == 0){
                    errorMessage = '申请失败，请重新刷新网络'
                }else{
                    errorMessage = JSON.parse(xhr.responseText)._error.message
                }
                fixBox.css({display: 'block'})
                hintMessage.text(errorMessage)
            }
        })
    }
})
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}