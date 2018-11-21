layui.use(['layer', 'upload', 'relation', 'form', 'hand', 'zTree','list','element'],
    function () {
        var layer = layui.layer;
        var list = layui.list;
        var hand = layui.hand;
        var form = layui.form();
        var relation = layui.relation;
        var element = layui.element;
        

        var pageList;
        
        var fun = {

            init: function () {
                pageList = list.init({
                    'url': '/versionManage/filterPermission/versionList',
                    'tpl': $("#listReleaseScript").html(),
                    'body': $("#listBody"),
                    'pageElement': 'pageDiv',
                    'method': {
                        //更新版本
                        update:function(target){
                            var versionId = target.parent().attr("data-id");
                            window.location.href = "/version/versionManage/updateVersion.html?versionId="+versionId;
                        },
                        downLoad:function(target){
                            var recordId = target.parent().attr("data-id");
                            window.location.href = "/versionManage/filterPermission/appDownLoad/"+recordId;
                        },
                    }
                });
            },
        }
		$(function(){
			fun.init();
		});
    });