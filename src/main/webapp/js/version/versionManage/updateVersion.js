layui.use(['layer','form', 'upload', 'hand','list'],
    function () {
	    var hand = layui.hand;
        var form = layui.form();

        var upload = layui.upload;

        var versionFileId = '';
        var projectId = '';
        var versionRecordId = '';
        var uploadUserID = '';
        //上传文件类型
        var type = 0;

        var fun = {
            init: function (versionId) {
                hand.ajax({
                    url: "/versionManage/filterPermission/queryVersion?versionId=" + versionId,
                    type: "get",
                    async: false,
                    success: function (data, msg) {
                        uploadUserID = data.uploadUserID;
                        $("#name").text(data.projectName);
                        $("#versionCode").val(data.versionCode);
                        $("#upgradeInfo").val(data.upgradeInfo);
                        $("#updateUserName").text(data.uploadUserName);
                        if (data.filePath) {
                            var index = data.filePath.lastIndexOf("/");
                            $("#fileName").text(data.filePath.substr(index+1));
                        }
                        projectId = data.projectID;
                        versionFileId = data.versionFileID;
                        if (1 == data.appType) {
                            $("#appType").text("Android");
                            //$("#androidType").css('display','block');
                            type = 1;
                        }
                        if (2 == data.appType) {
                            $("#appType").text("IOS");
                            $("#iosType").css('display', 'block');
                            if (data.plistFilePath) {
                                $("#plistFileName").text(data.plistFilePath);
                            }
                            type = 2;
                        }
                        if (data.packageName) {
                            $("#package").val(data.packageName);
                        }
                    }
                });
            },
            /**
             * @param elem dom元素id
             * @param ext 上传文件类型
             * @param fileType 文件保存位置 1 安卓 2 IOS 3 plist文件
             * @param msg 文件名回显dom id
             */
            upload: function (elem, ext, fileType, msg) {
                var index = '';//用来关闭提示框的序号
                upload({
                    url: '/file/uploadFiles?type=' + fileType
                    , elem: elem //指定原始元素，默认直接查找class="layui-upload-file"
                    , method: 'post' //上传接口的http类型
                    , ext: ext
                    , auto: false
                    , bindAction: '#next'
                    , before: function (obj) {
                        index = layer.msg("正在上传...", {time: false, shade: 0.1});
                    }
                    , success: function (res) {
                        if (200 == res.code) {
                            var app = {};
                            app.filePath = res.data;
                            app.fileType = type;
                            app.createTime = new Date();

                            var path = res.data;
                            var index = path.lastIndexOf("/");
                            $(msg).text(path.substr(index + 1));

                            hand.ajax({
                                url: "/versionManage/filterPermission/addVersionFile",
                                type: "post",
                                contentType: "application/json",
                                data: JSON.stringify(app),
                                success: function (data, msg) {
                                    if (data.id) {
                                        versionFileId = data.id;
                                    } else {
                                        alert(msg);
                                    }
                                }
                            });
                            layer.msg("上传完成", {time: 1000});
                            layer.close(index);
                        } else {
                            alert(res.msg);
                            layer.msg("上传失败", {time: 1000});
                            layer.close(index);
                        }
                    }
                })
            },
        };

        $(function(){
            //获取跳转页面链接后面的参数
            var versionId = GetPar("versionId");
            function GetPar(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if(r != null) return decodeURIComponent(r[2]);
                return null;
            }
            
        	fun.init(versionId);

            fun.upload("#app",'ipa|apk',type,'#fileName');

	    	$("#cancel").on('click',function(){
        		window.location.href = "/version/versionManage/versionList.html";
        	});
            var versionRecord ={};
        	$("#next").on('click',function(){
                versionRecord.projectID = projectId;
                versionRecord.appType = type;
                if(undefined == versionFileId){
                    alert("请上传版本");
                    return false;
                }else{
                    versionRecord.versionFileID = versionFileId;
                }
                versionRecord.packageName = $("#package").val().trim();
                versionRecord.versionCode = $("#versionCode").val().trim();
                versionRecord.upgradeInfo = $("#upgradeInfo").val().trim();
                versionRecord.createTime = new Date();
                versionRecord.isNew = 1;
                if (0 == versionRecord.packageName.length) {
                    alert("请输入包名");
                    return false;
                }
                if (0 == versionRecord.versionCode.length) {
                    alert("请输入版本号");
                    return false;
                }
                if (0 == versionRecord.upgradeInfo.length) {
                    alert("请输入更新信息");
                    return false;
                }
                $("#update").css('display','none');
                $("#release").css('display','block');
        	});

            $("#back").on('click',function(){
                $("#update").css('display','block');
                $("#release").css('display','none');
            });

            $("#confirm").on('click',function(){
                var chose = $('#release input[name="force"]:checked ').val();
                if(chose == undefined){
                    alert("请选择");
                    return false;
                }else{
                    versionRecord.lastForce = chose;
                    versionRecord.isNew = 1;
                    versionRecord.uploadUserID = uploadUserID;
                    hand.ajax({
                        url:"/versionManage/filterPermission/addVersionRecord",
                        type:"post",
                        contentType: "application/json",
                        data: JSON.stringify(versionRecord),
                        async: false,
                        success:function(data,msg) {
                            if(data.id){
                                versionRecordId = data.id;
                                //设置历史记录
                                var version2 = {};
                                version2.id = versionId;
                                version2.isNew = 0;
                                hand.ajax({
                                    url:"/versionManage/filterPermission/updateVersionRecord",
                                    type:"post",
                                    contentType: "application/json",
                                    data: JSON.stringify(version2),
                                    async:false,
                                    success:function(data,msg){
                                        if(1 == data){
                                            window.location.href = "/version/versionManage/versionList.html";
                                        }else{
                                            alert("设置更新前版本为历史记录错误");
                                        }
                                    }
                                });
                                /*$("#update").css('display','none');
                                 $("#release").css('display','block');*/
                            }else{
                                alert(msg);
                                return false;
                            }
                        }
                    });
                }
            });
        });
    });