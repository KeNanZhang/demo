layui.use(['layer','form', 'upload', 'hand','list'],
    function () {
	    var hand = layui.hand;
        var form = layui.form();

        var upload = layui.upload;

        var plistFileId = '';
        //有哪些版本
        var isAndroid = 0;
        var isIOS = 0;

        var fun = {
            init: function () {
                
            },
			queryProject:function(projectId){
                hand.ajax({
                    url:"/projectManage/filterPermission/queryProject?id="+projectId,
                    type:"get",
                    success:function(data,msg) {
                       $("#projectId").text(data.id);
                       $("#projectName").val(data.name);
                       $("#projectKey").text(data.projectKey);
                       $("#description").val(data.description);
                        isAndroid = data.isAndroid;
                        isIOS = data.isIOS;
                        if(1 == isAndroid){
                            $("#androidType").css('display','block');
                            $("#android").attr("checked","checked");
                            $("#androidPackage").val(data.androidPackage);
                        }
                        if(1 == isIOS){
                            $("#iosType").css('display','block');
                            $("#ios").attr("checked","checked");
                            $("#iosPackage").val(data.iosPackage);
                            $("#fileName").text(data.fileName);
                        }
                        form.render();
                    }
                });
			},

        }

        $(function(){
                var projectId = GetPar("id");
                function GetPar(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if(r != null) return decodeURIComponent(r[2]);
                    return null;
                }
                fun.queryProject(projectId);

            form.on('checkbox(type)', function(obj){
                var type = $(this).val();
                var check = obj.elem.checked;
                if(true == check){
                    if(1 == type){
                        $("#androidType").css('display','block');
                        isAndroid = 1;
                    }
                    if(2 == type){
                        $("#iosType").css('display','block');
                        isIOS = 1;
                    }
                }else{
                    if(1 == type){
                        $("#androidType").css('display','none');
                        isAndroid = 0;
                    }
                    if(2 == type){
                        $("#iosType").css('display','none');
                        isIOS = 0;
                    }
                }
            });



                $("#cancel").on('click',function(){
                    window.location.href = "/version/projectManage/projectList.html";
                });
            	$("#update").on('click',function(){
                    var project ={};
                    project.id = projectId;
                    project.name = $("#projectName").val().trim();
                    project.isAndroid = isAndroid;
                    project.androidPackage = $("#androidPackage").val().trim();
                    project.isIOS = isIOS;
                    project.iosPackage = $("#iosPackage").val().trim();
                    project.description = $("#description").val();
                    if (0 == project.name.length) {
                        alert("请输入项目名称");
                        return false;
                    }
                    if(0 == project.isAndroid && 0 == project.isIOS){
                        alert("请选择需要安装包类型");
                        return false;
                    }else{
                        if (1 == project.isAndroid && 0 == project.androidPackage.length) {
                            alert("请选择安卓包名");
                            return false;
                        }
                        if (1 == project.isIOS && 0 == project.iosPackage.length) {
                            alert("请选择ios包名");
                            return false;
                        }
                    }
                    if (0 == project.description.length) {
                        alert("请输入项目描述");
                        return false;
                    }
                    hand.ajax({
                        url:"/projectManage/filterPermission/updateProject",
                        type:"post",
                        contentType: "application/json",
                        data: JSON.stringify(project),
                        success:function(data,msg) {
                            if(1 == data){
                            	alert("修改成功");
                                window.location.href = "/version/projectManage/projectList.html";
							}else{
                            	alert(msg);
							}
                        }
                    });
				})
	    });
    })