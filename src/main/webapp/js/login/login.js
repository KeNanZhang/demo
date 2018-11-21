//
layui.use(['layer', 'laytpl', 'laypage', 'hand', 'list', 'form'],
    function() {
        var hand = layui.hand;
        var layer = layui.layer;
        var account,password,verifyCode;
        //取key值account和password的value
        $("#account").val(localStorage.account);
        $("#password").val(localStorage.password);
        var webLogin={};
        webLogin.login=function(account,password,verifyCode){
            $("#enterpriseState").val("1");
            $("#superiorDataName").val("1");
            $.ajax({
                url:"/logins",
                type:"post",
                data:{"account":account,"password":password,"verifyCode":verifyCode},
                success:function(data){
                    if(data.code==200){
                        //存储localStorage，key值：account，value：用户名
                        localStorage.setItem("account",account);
                        //存储localStorage，key值：password，value：密码
                        localStorage.setItem("password",password);
                        top.location.href="../../index.html";
                    }else{
                        layer.msg(data.msg);
                        webLogin.changeCode();
                    }
                }
            });
        }
        webLogin.changeCode=function(){
            $("#codeImg").attr("src","/verifyCode?"+new Date().getTime());
        }
        $(function(){
            $("#login").click(function(){
                account = $("#account").val();
                password = $("#password").val();
                verifyCode = $("#verifyCode").val();
                if(account==''){
                    layer.msg("请输入用户名");
                }else if(password==''){
                    layer.msg("请输入密码");
                }else if(verifyCode==''){
                    layer.msg("请输入验证码");
                }else{
                    webLogin.login(account,password,verifyCode);
                }

            });
            $(".changecode").click(function(){
                webLogin.changeCode();
            });
            $(document).keydown(function (event) {
                if (13 == event.which)
                //用户按下回车
                {
                    $("#login").click();
                }
            });
            $('#regist').click(function(){
                window.location.href="/regist";
            });
            $('#resetPwd').click(function(){
                window.location.href="/resetPwd";
            });
        })
    });