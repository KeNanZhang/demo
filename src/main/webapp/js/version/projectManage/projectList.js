layui.use(['layer', 'upload', 'relation', 'form', 'hand', 'dataDict', 'zTree','list','element'],
    function () {
        var layer = layui.layer;
        var list = layui.list;
        var hand = layui.hand;
        var dataDict = layui.dataDict;
        var form = layui.form();
        var relation = layui.relation;
        var element = layui.element;
        

        var pageList;
        
        var fun = {

            init: function () {
                pageList = list.init({
                    'url': '/projectManage/filterPermission/projectList',
                    'tpl': $("#listReleaseScript").html(),
                    'body': $("#listBody"),
                    'pageElement': 'pageDiv',
                    'method': {
                        // 查询详情
                        detail:function(target){
                            var projectId = target.parent().attr("data-id");
                            window.location.href = "/version/projectManage/projectDetail.html?projectId="+projectId;
                        },
                        //修改
                        editMethod:function(target){
    						var projectId = target.parent().attr("data-id");
    						window.location.href="/version/projectManage/editProject.html?id="+projectId;
    					}
    					//删除
    					,deleteMethod:function(target){
                            var projectId = target.parent().attr("data-id");
    						layer.confirm("确定要删除吗?",function() {
                             	hand.ajax({
                            		url:"/projectManage/filterPermission/delete/"+projectId,
                            		type:"delete",
                            		success:function(data,msg) {
                            			if(1 == data){
                                            layer.msg(msg, {time: 3000,shift: -1, icon:1}, function () {
                                                window.parent.location.reload();
                                            });
                                        }else{
                            				alert(msg);
										}
                                	}
                            	});
                            })
    					}/*,
                        updateVersion:function (target) {
                            var projectId = target.parent().attr("data-id");
                            window.location.href = "/version/versionManage/versionList.html";
                            
                        }*/
                    }
                });

            },
        }
		$(function(){
			fun.init();

			$("#add").on('click',function(){
			    window.location.href = "/version/projectManage/addProject.html";
            })
		})

    })