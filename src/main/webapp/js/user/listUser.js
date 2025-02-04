/**
 * Created by leixinhui on 2017/8/28.
 */
layui.use(['layer', 'laytpl', 'laypage','hand', 'list', 'form'],
    function() {
        var layer = layui.layer;
        var laytpl = layui.laytpl;
        var hand = layui.hand;
        var list = layui.list;
        var form = layui.form();
        var condition = {};
        var pageList;
        var fun = {
            //初始化
            init : function(){
                pageList = list.init({
                    'url': '/userRole/userRoleList',
                    'tpl': $("#listScript").html(),
                    'body': $("#listBody"),
                    'pageElement': 'pageDiv',
                    'method': {
                        //修改
                        update:function(target){
                            var id = target.parent().attr("data-id");
                            layer.open({
                                type:2,
                                title:"修改用户",
                                area:['1120px','69%'],
                                maxmin:false,
                                closeBtn: 1,
                                content: 'userRes.html?id='+id,
                            });
                        },
                        //删除
                        delete :function(target){
                            var id = target.parent().attr("data-id");
                            layer.confirm("确定要删除该用户吗？",
                                function() {
                                    hand.ajax({
                                        url: "/userRole/deleteUser/"+id,
                                        type : "POST",
                                        success : function(data,msg) {
                                            layer.msg(msg,{
                                                    time : 3000,
                                                    shift : -1,
                                                    icon : 1
                                                },
                                                function() {
                                                });
                                        }
                                    });
                                    window.location
                                        .reload();
                                })
                        },//禁用
                        forbidden :function(target){
                            var id = target.parent().attr("data-id");
                            layer.confirm("确定要禁用该用户吗？",
                                function() {
                                    hand.ajax({
                                        url: "/userRole/forbiddenUser/"+id,
                                        type : "POST",
                                        success : function(data,msg) {
                                            layer.msg(msg,{
                                                    time : 3000,
                                                    shift : -1,
                                                    icon : 1
                                                },
                                                function() {
                                                });
                                        }
                                    });
                                    window.location
                                        .reload();
                                })
                        }
                    },

                });
            },
            //查询
            search : function(){
            	condition.account = $("#account").val();
                pageList.config({
                	condition:condition
                });
                pageList.jump(1);
            },



        }


        // 页面加载后
        $(function() {
            //初始化
            fun.init();
            form.render();
            //查询
            $("#search").on("click",function() {
                fun.search();
            })
            //新增
            $("#insert").on("click",function() {
                layer.open({
                    type:2,
                    title:"新增信息",
                    area:['1120px','69%'],
                    maxmin:false,
                    closeBtn: 1,
                    content: 'userRes.html',
                });
            })
            //时间戳的处理
            layui.laytpl.toDateString = function(d, format){
                var date = new Date(d || new Date())
                    ,ymd = [
                    this.digit(date.getFullYear(), 4)
                    ,this.digit(date.getMonth() + 1)
                    ,this.digit(date.getDate())
                ]
                    ,hms = [
                    this.digit(date.getHours())
                    ,this.digit(date.getMinutes())
                    ,this.digit(date.getSeconds())
                ];

                format = format || 'yyyy-MM-dd HH:mm:ss';

                return format.replace(/yyyy/g, ymd[0])
                    .replace(/MM/g, ymd[1])
                    .replace(/dd/g, ymd[2])
                    .replace(/HH/g, hms[0])
                    .replace(/mm/g, hms[1])
                    .replace(/ss/g, hms[2]);
            };

            //数字前置补零
            layui.laytpl.digit = function(num, length, end){
                var str = '';
                num = String(num);
                length = length || 2;
                for(var i = num.length; i < length; i++){
                    str += '0';
                }
                return num < Math.pow(10, length) ? str + (num|0) : num;
            };
        });

    });

