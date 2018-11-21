layui.use([ 'layer', 'form', 'upload', 'hand', 'relation' ], function() {
	var hand = layui.hand;
	var form = layui.form();

	var plistAddress = '';//ios下载的plist文件地址
	
	var fun={
			queryInfo : function(projectId) {
			var appInfo = {};
			appInfo.id = projectId;
			hand.ajax({
				url : "/versionManage/filterPermission/queryIosInfo",
				type : "post",
				contentType : "application/json",
				data : JSON.stringify(appInfo),
				success : function(data, msg) {
                    var index = data.updateUrl.lastIndexOf("/");
					$("#appName").text(data.updateUrl.substr(index+1));

					$("#createTime").text(data.createTime);
					$("#versionCode").text(data.versionCode);
					$("#versionName").text("("+data.versionName+")");
					
					plistAddress = data.plistAddress;
					
					if(0 == data.upgradeInfo.length){
						$(".log").css('display','none');
					}else{
						$("#remark").text(data.upgradeInfo);
					}
				}});
			}
	}

	$(function() {
        //获取跳转页面链接后面的参数
        var projectId = GetPar("projectId");
        function GetPar(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r != null) return decodeURIComponent(r[2]);
            return null;
        }
		fun.queryInfo(projectId);
		
		$("#download").on("click", function () {
			$("button").css('display','none');
			 setTimeout(function(){
				 $(".message").css('display','block');
			 },1000);
			 setTimeout(function(){
				 window.location.href = plistAddress;
			 },2000);
        });
	});
});