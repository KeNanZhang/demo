//登录用户信息显示
layui.use([],
    function() {
        $(function(){
            $.ajax({
                url:"/loginUser",
                type:"get",
                success:function(data, msg) {
                    document.getElementById("userName").innerText = data.data[0];
                    if(data.data[1]==2){
                        document.getElementById("userManage").style.display="none";
                    }
                }
            });
        })
    });