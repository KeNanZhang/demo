layui.use(['layer', 'laytpl','upload','element', 'form', 'hand', 'zTree','list'],
    function () {
        var hand = layui.hand;
        var form = layui.form();
        var element = layui.element();
        var laytpl = layui.laytpl;


        var fun = {

            init: function (projectId) {
                hand.ajax({
                    url:"/projectManage/filterPermission/queryDetail?projectId="+projectId,
                    type:"get",
                    success:function(data,msg) {
                        if(data.isAndroid){
                            $("#an").addClass("layui-this");
                            $("#version").css('display','none');
                            $("#android").css('display','block');

                            $("#name").text(data.name);
                            if(null == data.description){
                                $("#description").text("- -");
                            }else{
                                $("#description").text(data.description);
                            }
                            $("#projectId").text(data.id);
                            $("#projectKey").text(data.projectKey);
                            $("#createUser").text(data.createUser);
                            $("#createTime").text(data.createTime);
                        }else{
                            $("#an").css('display','none');
                            if(data.isIOS){
                                $("#ios").addClass("layui-this");
                                $("#version2").css('display','none');
                                $("#iosContent").css('display','block');

                                $("#name2").text(data.name);
                                if(null == data.description){
                                    $("#description2").text("--");
                                }else{
                                    $("#description2").text(data.description);
                                }
                                $("#projectId2").text(data.id);
                                $("#projectKey2").text(data.projectKey);
                                $("#createUser2").text(data.createUser);
                                $("#createTime2").text(data.createTime);
                            }else{
                                $("#ios").css('display','none');
                            }
                        }
                    }
                });
            },
            versionRecord:function(id,type,script,dom,name,description){
                hand.ajax({
                    url:"/projectManage/filterPermission/versionRecord?id="+id+"&type="+type,
                    type:"get",
                    success:function(data,msg) {
                        if(0 != data.length){
                            $(name).text(data[0].projectName);
                            $(description).text(data[0].description);
                        }
                        var getTpl = $(script).html();
                        laytpl(getTpl).render(data, function(html){
                            $(dom).html(html);
                        });
                    }
                });
            },
        }
		$(function(){
		    //获取跳转页面链接后面的参数
            var projectId = GetPar("projectId");
            function GetPar(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if(r != null) return decodeURIComponent(r[2]);
                return null;
            }
            fun.init(projectId);
            //选项卡切换
            element.on('tab(demo)', function(elem){
                if(0 == elem.index){
                    $("#iosContent").css('display','none');
                    fun.init(projectId);
                }
                if(1 == elem.index){
                    $("#an").removeClass("layui-this");
                    $("#android").css('display','none');
                    hand.ajax({
                        url: "/projectManage/filterPermission/queryDetail?projectId=" + projectId,
                        type: "get",
                        success: function (data, msg) {
                            $("#iosContent").css('display','block');
                            $("#version2").css('display','none');
                            $("#name2").text(data.name);
                            if(null == data.description){
                                $("#description2").text("--");
                            }else{
                                $("#description2").text(data.description);
                            }
                            $("#projectId2").text(data.id);
                            $("#projectKey2").text(data.projectKey);
                            $("#createUser2").text(data.createUser);
                            $("#createTime2").text(data.createTime);
                        }
                    });
                }
            });
            //安卓子菜单选择
            element.on('nav(android)', function(elem){
                if("项目信息" == elem.text()){
                    $("#version").css('display','none');
                    $("#msg").css('display','block');
                    fun.init(projectId);
                }
                if("版本记录" == elem.text()){
                    $("#version").css('display','block');
                    $("#msg").css('display','none');
                    fun.versionRecord(projectId,1,'#recordList','#record',"#versionName","#versionDescription");
                }
            });
            //ios子菜单选择
            element.on('nav(ios)', function(elem){
                $("#version2").css('display','none');
                $("#msg2").css('display','block');
                if("项目信息2" == elem.text()){
                    hand.ajax({
                        url: "/projectManage/filterPermission/queryDetail?projectId=" + projectId,
                        type: "get",
                        success: function (data, msg) {
                            $("#iosContent").css('display','block');

                            $("#name2").text(data.name);
                            if(null == data.description){
                                $("#description2").text("--");
                            }else{
                                $("#description2").text(data.description);
                            }
                            $("#projectId2").text(data.id);
                            $("#projectKey2").text(data.projectKey);
                            $("#createUser2").text(data.createUser);
                            $("#createTime2").text(data.createTime);
                        }
                    });

                }
                if("版本记录2" == elem.text()){
                    $("#version2").css('display','block');
                    $("#msg2").css('display','none');
                    fun.versionRecord(projectId,2,'#recordList2','#record2',"#versionName2","#versionDescription2");
                }
            });
		})
    })