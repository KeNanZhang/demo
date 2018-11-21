$(function() {
	var btns = $('button'); 
//	var publicButton = $('.publicButton'); //无需过滤的按钮
	var info = null;
	var ajaxFlag = true;
	if(self != top){ 
		info = top.getInfo();
	}else{
		info = getInfo();
	}
	/*console.log(info);
	console.log(info.title);*/
	
	var menuID = info.menuID;
	info.titArr[menuID]=info.title;
	
	//点击a标签获取当前href 并赋值给上一个a标签的href值
	var locatonHref = window.location.href;
	/*var infoTit = info.title.split('');
	var n = infoTit.indexOf('#');
	if(n != -1){
		infoTit.splice(n,1,locatonHref);
		//console.log(infoTit);
		info.title = infoTit.join('');
	}*/
	//console.log(info.titArr[menuID]);
	if(info.titArr[menuID]){
		var infoTit = info.titArr[menuID].split('');
		var n = infoTit.indexOf('#');
		if(n != -1){
			infoTit.splice(n,1,locatonHref);
			info.titArr[menuID] = infoTit.join('');
		}
	}
	
	
	//页面内的标签
	var appendTitle;
	var tag = $("#sst");//获取导航标签
	tag.html(info.titArr[menuID]);
	
	
	//页面上导航条的点击事件
	tag.find("a").click(function(){
		var tagTitle = $(this).text();
		var level = $(this).attr("class");
		var type = $(this).data("type");
		if(level == 'aRel' || level == 2 || type == 2 || tagTitle.indexOf('设备视角') != -1){
			var currLength = info.title.indexOf(tagTitle);
			info.title = info.title.substring(0,currLength+tagTitle.length);
		}
	});
	
	if(info.userType != 0 && btns.length > 0){
		//btns.hasClass("publicButton").show().sibling().hide();
		for (var i = 0; i < btns.length; i++) {
			var curr = $(btns[i]);
			if(!curr.hasClass("publicButton")){
				curr.hide();//按钮隐藏
			}
		}
	}
	
	 $.ajaxSetup({
		 beforeSend: function () {
		     //ajax请求之前
			// this.layerIndex = layer.load(0, { shade: [0.5, '#393D49'] });
		 },
		 complete:function ( data, textStatus, jqXHR) {
			 var btns = $('button');  
			 var a = $("a.layButton");
			 if(info.userType != 0 && btns.length > 0){//页面按钮的显示和隐藏
				for (var i = 0; i < btns.length; i++) {
					var curr = $(btns[i]);
					if(!curr.hasClass("publicButton")){
						curr.hide();//按钮隐藏
					}
				}
			}
			if(info.userType!=0 && a.length > 0){//a标签的显示和隐藏
				for (var i = 0; i < a.length; i++) {
					var curr = $(a[i]);
					if(!curr.hasClass("publicButton")){
						curr.hide();//按钮隐藏
					}
				}
			}
//			 publicButton.show();
			 
			 //ajax请求完成，不管成功失败 
			 getPermissionByMenuID();
			 layer.close(this.layerIndex);
			 
			 $("a").click(function(){					
				appendTitle = $(this).find('span.txt').text();
				
				if(appendTitle && info.titArr[menuID].indexOf(appendTitle) == -1){
					info.titArr[menuID] += "<a href='#' class='aRel'>"+appendTitle+"-"+"</a>";
					info.title =info.titArr[menuID];
				}				
			});
			 
			//监测页面的a标签
			/*var index = parent.$(".layui-tab-content").find(".layui-show").index();
			if(parent.$('iframe')[index] != undefined){
				//页面上的a标签点击事件
				parent.$('iframe')[index].contentWindow.*/


				
				
//			}
			 $(document).keydown(function (e) {
				    if (e.keyCode == 32) {
				        return false;
				    }
			 });
			 
		 },		
		 error: function () {
			 //ajax请求失败
			 //alert("请求失败了");
		 }
	});
	 
	 /*setTimeout(function(){
		 $("a").click(function(){					
				appendTitle = $(this).find('span.txt').text();
				
				if(appendTitle){
					info.title += "<a href='#' class='aRel'>"+appendTitle+"-"+"</a>";
					//console.log("后tag:"+info.title);
				}				
		}); 
	 },500);*/
		 
		
//	 }
	//根据当前选中的menuID查询用户所拥有的权限
	function getPermissionByMenuID(){
		var info = null;
		if(self!=top){ 
			info = top.getInfo();
		}else{
			info=getInfo();
		}
		//var info = window.parent.getInfo();//选中的menuID
		//console.log("menuID:"+info.menuID);
		//console.log("permissionList:"+info.permissionList);
		
		var permissionList = info.permissionList;//用户所能操作的权限List
		//var menuPermissionList = new Array();//当前菜单下用户所能操作的权限ids
		if(permissionList != null && permissionList.length > 0){
			for (var i = 0; i < permissionList.length; i++) {
				var buttonType = permissionList[i].buttonType;
				//console.log("buttonType:"+buttonType);
				//if(info.menuID == permissionList[i].menuID){
					//menuPermissionList.push(permissionList[i].id);
					if(buttonType){
						$("."+buttonType).show();//按钮显示 
						//console.log("按钮显示:"+buttonType);
					}
				//}/*else{
					//$("."+buttonType).hide();//按钮隐藏
				//}*/
			}
		}
	}
	
	getPermissionByMenuID();
	
	//	表单验证
	layui.use(['form','jquery'], function () {
        var form = layui.form();
//        var element = layui.element();
        var $ = layui.jquery;            
        form.verify({
            phoneIpt:function (value) {
                if(!new RegExp("^1[3|4|5|7|8|9][0-9]{9}$").test(value)){//1开头，第二位不能0.1.2，共11尾数
                    return '请输入规范的手机号码';
                }
            }
            ,searchIpt: function (value, item) { //value：表单的值、item：表单的DOM对象
                    if (new RegExp("\[@|#|%|$]+").test(value)) {
                        return '不能有特殊字符@#%$';
                    }

                    // if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    //     return '用户名不能有特殊字符';
                    // }
                    // if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    //     return '用户名首尾不能出现下划线\'_\'';
                    // }
                    // if (/^\d+\d+\d$/.test(value)) {
                    //     return '用户名不能全为数字';
                    // }
                }               
        });  

        
        try { 
            if(!info.element)  throw "释放的变量";
        }
        catch(err) {
        	info.element = top.getInfo().element;
        	info.element.on('tab(top-tab)', function(data){
        		var windowID  = $(this).attr('lay-id');
        		if(windowID){
        			info.menuID=windowID;
        			info.title = info.titArr[windowID];
        		}
        	});
        }
//        console.log(info.element);
//        if(!info.element){
//        	info.element = top.getInfo().element;
//        }
//    	info.element.on('tab(top-tab)', function(data){
//    		console.log(info.element);
//    		var windowID  = $(this).attr('lay-id');
//    		if(windowID){
//    			info.menuID=windowID;
//    			info.title = info.titArr[windowID];
//    		}
//    	});
        
}); 
	
});
