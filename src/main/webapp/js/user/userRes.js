/**
 * Created by leixinhui on 2017/8/28.
 */
layui.use(['layer', 'laytpl', 'laypage','hand', 'list', 'form'],
    function() {
        var layer = layui.layer;
        var laytpl = layui.laytpl;
        var hand = layui.hand;
        var laypage = layui.laypage;
        var list = layui.list;
        var form = layui.form;
        var condition = {};
        var pageList;
        var userList = {};
        var pass
        var fun = {
            //初始化
            init : function(){
                $("#account").val("");
                $("#password").val("");
                var thisURL = document.URL;
                var  getval =thisURL.split('?')[1];
                if(getval!=null && getval!=""){
                    var id= getval.split("=")[1];
                    $('#id').val(id);
                    $.ajax({
                        url:"/userRole/selectUserRoleKey?id="+id,
                        type:"get",
                        success:function(data, msg) {
                            var result = data.data;
                            //禁止编辑
                            document.getElementById("account").disabled = true;
                            pass = result.password;
                            //传值
                            $("#account").val(result.account);
                            $("#password").val(result.password);
                            $("#userName").val(result.userName);
                            $("#roleId").val(result.roleId);
                            $("#status").val(result.status);
                            $("input[name='radio1'][value='1']").attr("checked", result.roleId == 1 ? true : false);
                            $("input[name='radio1'][value='2']").attr("checked", result.roleId == 2 ? true : false);
                            $("input[name='radio2'][value='0']").attr("checked", result.status == 0 ? true : false);
                            $("input[name='radio2'][value='1']").attr("checked", result.status == 1 ? true : false);
                            form.render();
                        }
                    });
                }
            }



        }


        // 页面加载后
        $(function() {
            //初始化
            fun.init();
            form.render();

            $("#password").on("click",function(){
                $("#password").val("");
                pass="";
            });
            //账号仅支持中英文和数字，长度为4-14个英文数字或2-7个汉字
            var accountReg = /^[\u4e00-\u9fa5]{2,7}$|^[\dA-Za-z_]{4,14}$/;
            //密码由6-16位数字、字母或符号组成，至少含有2种及以上的字符
            var passwordReg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;

            var roleName = $("input[name='roleName']:checked").val();
            form.on('radio(radio1)', function(data){
                var role =  data.othis[0].innerText;
                role = role.substr(1);
                if(role=="管理员"){
                    $('#roleId').val(1);
                }else{
                    $('#roleId').val(2);
                }
            });
            form.on('radio(radio2)', function(data){
                var role =  data.othis[0].innerText;
                role = role.substr(1);
                if(role=="可用"){
                    $('#status').val(1);
                }else{
                    $('#status').val(0);
                }
            });

            //自定义验证规则
            form.verify({
                // 账号
                account: function (value) {
                    if (value.length == 0||value.trim().length==0) {
                        return '用户账号不能为空';
                    }

                    if(!accountReg.test(value)){
                        return '账号仅支持中英文和数字，最长为14个英文或7个汉字';
                    }
                    if(document.getElementById("account").disabled != true){
                        var result = "";
                        $.ajax({
                            url:"/userRole/userRoleList",
                            type:"post",
                            async: false,
                            success:function(data, msg) {
                                var re = data.data.pageData;
                                for(var i=0;i<re.length;i++){
                                    if(re[i].account==value){
                                        result = "该账号已被注册";
                                    }
                                }
                            }
                        });
                        if(result!=null && result!=""){
                            return result;
                        }
                    }

                },
                //密码
                password: function (value) {
                    if (value.length == 0||value.trim().length==0) {
                        return '用户密码不能为空';
                    }
                    if(pass==""&&!passwordReg.test(value)){
                        return '密码由6-16位数字、字母或符号组成，至少含有2种及以上的字符';
                    }
                },
                //用户姓名
                userName: function (value) {
                    if (value.length == 0||value.trim().length==0) {
                        return '用户姓名不能为空';
                    }
                },
                //用户角色
                roleId: function (value) {
                    if (value.trim().length==0) {
                        return '用户角色不能为空';
                    }
                },
                //状态
                status: function (value) {
                    if (value.length == 0||value.trim().length==0) {
                        return '用户状态不能为空';
                    }
                }
            });
            //保存
            form.on('submit(handleForm)', function (data) {
                var id=document.getElementById('id').value;
                var field = data.field;
                if(id!=null && id!=""){
                    if(!passwordReg.test(field["password"])){
                        field["password"]="";
                    }
                    field["id"] = id;
                    // 修改
                    hand.ajax({
                        url : "/userRole/modifyUser",
                        type : "post",
                        contentType:"application/json",
                        data : JSON.stringify(field),
                        success : function(data, msg) {
                            layer.msg(msg, {time: 3000,shift: -1, icon:1}, function () {
                                window.parent.location.reload();
                            });
                        }
                    });
                }else{
                    // 新增
                    hand.ajax({
                        url : "/userRole/inserUser",
                        type : "post",
                        contentType:"application/json",
                        data : JSON.stringify(field),
                        success : function(data, msg) {
                            layer.msg(msg, {time: 3000,shift: -1, icon:1}, function () {
                                window.parent.location.reload();
                            });
                        }
                    });
                }
                return false;
            });

        });
    });

