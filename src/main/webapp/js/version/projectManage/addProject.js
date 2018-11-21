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
        }

        $(function(){
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
        	
        	$("#save").on('click',function(){
        		var project ={};
        		project.name = $("#projectName").val().trim();
        		project.isAndroid = isAndroid;
        		project.androidPackage = $("#androidPackage").val().trim();
        		project.isIOS = isIOS;
        		project.iosPackage = $("#iosPackage").val().trim();
        		project.plistAddress = $("#plistAddress").val().trim();
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
                    }else{
                        if (1 == project.isIOS && 0 == project.plistAddress.length) {
                            alert("请输入plist文件地址");
                            return false;
                        }
                    }
                }
                if (0 == project.description.length) {
				    alert("请输入项目描述");
				    return false;
                }
        		hand.ajax({
            		url:"/projectManage/filterPermission/addProject",
            		type:"post",
            		contentType: "application/json",
                    data: JSON.stringify(project),
            		success:function(data,msg) {
                        if(1 == data){
                            window.location.href = "/version/projectManage/projectList.html";
                        }else{
                            alert(msg);
                        }
                    }
             	});
        	});
	    });
    });