layui.define([ 'layer', 'form' ], function(exports) { // 提示：组件也可以依赖其它组件，如：layui.define('layer',
	// callback);
	var layer = layui.layer, form = layui.form();
	var fun = {
		ajax : function(config) {
			// url , type , data , success

			var loadIndex = layer.load();

			var ajaxConfig = {
				url : "url" in config ? config.url : "",
				type : "type" in config ? config.type : "POST",
				data : "data" in config ? config.data : {},
				async : "async" in config ? config.async : true,
				cache: "cache" in config ? config.cache : false,
				// ifModified: "ifModified" in config ? config.ifModified :
				// true,
				success : function(data, status, xhr) {
					layer.close(loadIndex);
					if (typeof data == 'string') {
						if (data.indexOf("showMsg") > 0) {
							window.parent.showMsg('对不起, 您没有该操作权限!');
							return;
						}

						if (data.indexOf("javascript") > 0) {
							window.parent.parent.location.href = '/';
							return;
						}
					}
					if (data.code == 200) {
						"success" in config ? config.success(data.data,data.msg) : function() {
							layer.msg(data.msg);
						}();
					}else if (data.code == 201) {
						layer.alert(data.msg);
						top.location.href="/login";
					} else {
						layer.msg(data.msg);
					}
				},
				error : function(xhr, error, exception) {
					
					"error" in config?config.error:function(){
						layer.close(loadIndex);
						layer.msg("请求错误");
					}
				}
			};
			if ("contentType" in config) {
				ajaxConfig.contentType = config.contentType;
			}
			if ("dataType" in config) {
				ajaxConfig.dataType = config.dataType;
			}
			$.ajax(ajaxConfig);
		},
		tableAsyncAjax : function(config) {
			// url , type , data , success

			var ajaxConfig = {
				url : "url" in config ? config.url : "",
				type : "type" in config ? config.type : "POST",
				data : "data" in config ? config.data : {},
				async : true,
				cache: "cache" in config ? config.cache : false,
				// ifModified: "ifModified" in config ? config.ifModified :
				// true,
				success : function(data, status, xhr) {
					if (typeof data == 'string') {
						if (data.indexOf("showMsg") > 0) {
							window.parent.showMsg('对不起, 您没有该操作权限!');
							return;
						}

						if (data.indexOf("javascript") > 0) {
							window.parent.parent.location.href = '/';
							return;
						}
					}
					if (data.code == 200) {
						"success" in config ? config.success(data.data,data.msg) : function() {
							layer.msg(data.msg);
						}();
					    if(config.fn!=null){
					    	config.fn.tableAsyncEventBind(config.elem);
					    }
					}else if (data.code == 201) {
						layer.alert(data.msg);
						top.location.href="/login";
					} else {
//						layer.msg(data.msg);
					}
				},
				error : function(xhr, error, exception) {
					
					"error" in config?config.error:function(){
						layer.msg("请求错误");
					}
				}
			};
			if ("contentType" in config) {
				ajaxConfig.contentType = config.contentType;
			}
			if ("dataType" in config) {
				ajaxConfig.dataType = config.dataType;
			}
			$.ajax(ajaxConfig);
		},
		/**
		 * 日期对象转换为指定格式的字符串
		 * 
		 * @param f
		 *            日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
		 * @param date
		 *            Date日期对象, 如果缺省，则为当前时间
		 * 
		 * YYYY/yyyy/YY/yy 表示年份 MM/M 月份 W/w 星期 dd/DD/d/D 日期 hh/HH/h/H 时间 mm/m 分钟
		 * ss/SS/s/S 秒
		 * @return string 指定格式的时间字符串
		 */
		dateToString : function(date , formatStr) {
			formatStr = formatStr || "yyyy-MM-dd HH:mm:ss";
			date = date || new Date();
			var str = formatStr;
			var Week = [ '日', '一', '二', '三', '四', '五', '六' ];
			str = str.replace(/yyyy|YYYY/, date.getFullYear());
			str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date
							.getYear() % 100).toString() : '0'+ (date.getYear() % 100));
			str = str.replace(/MM/, date.getMonth() > 9 ? (date.getMonth() + 1)
					: '0' + (date.getMonth() + 1));
			str = str.replace(/M/g, date.getMonth());
			str = str.replace(/w|W/g, Week[date.getDay()]);
			str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate()
					.toString() : '0' + date.getDate());
			str = str.replace(/d|D/g, date.getDate());
			str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours()
					.toString() : '0' + date.getHours());
			str = str.replace(/h|H/g, date.getHours());
			str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes()
					.toString() : '0' + date.getMinutes());
			str = str.replace(/m/g, date.getMinutes());
			str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date
					.getSeconds().toString() : '0' + date.getSeconds());
			str = str.replace(/s|S/g, date.getSeconds());
			return str;
		},
		/**
		* 把指定格式的字符串转换为日期对象yyyy-MM-dd HH:mm:ss
		* 
		*/
		stringToDate : function(dateStr , formatStr){
			var year = 0;
			var start = -1;
			var len = dateStr.length;
			formatStr = formatStr || "yyyy-MM-dd HH:mm:ss";
			if((start = formatStr.indexOf('yyyy')) > -1 && start < len){
				year = dateStr.substr(start, 4);
			}
			var month = 0;
			if((start = formatStr.indexOf('MM')) > -1  && start < len){
				month = parseInt(dateStr.substr(start, 2)) - 1;
			}
			var day = 0;
			if((start = formatStr.indexOf('dd')) > -1 && start < len){
				day = parseInt(dateStr.substr(start, 2));
			}
			var hour = 0;
			if( ((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len){
				hour = parseInt(dateStr.substr(start, 2));
			}
			var minute = 0;
			if((start = formatStr.indexOf('mm')) > -1  && start < len){
				minute = dateStr.substr(start, 2);
			}
			var second = 0;
			if((start = formatStr.indexOf('ss')) > -1  && start < len){
				second = dateStr.substr(start, 2);
			}
			return new Date(year, month, day, hour, minute, second);
		},
		/**
		* 经纬度校验
		* 
		*/
		verify : function(){
			return {
				longitude:function(value){
					var longitudeValue = value.trim();
					var regularLongitude = /^(((\d|[1-9]\d|1[0-7]\d)\.\d{1,6})|(\d|[1-9]\d|1[0-7]\d)|180\.0{1,6}|180)$/;
					if(!longitudeValue){
						return '经度不能为空';
					}
					else if (!new RegExp(regularLongitude).test(longitudeValue)){
						return '要求经度整数部分为0-180,小数部分为0到6位！';
					}
				},
				latitude:function(value){
					var latitudeValue = value.trim();
					var regularLatitude = /^(((\d|[1-8]\d)\.\d{1,6})|(\d|[1-8]\d)|90\.0{1,6}|90)$/;
					if(!latitudeValue){
						return '纬度不能为空';
					}
					else if (!new RegExp(regularLatitude).test(latitudeValue)){
						return '要求纬度整数部分为0-90,小数部分为0到6位！';
					}
				},
				requiredPlus:function(value , input){
	            	var errorMsg = $(input).attr("placeholder");
	            	if(!value){
	            		return errorMsg+"不能为空";
	            	}
	            },
	            number:function(value,input){
					var number = value.trim();
					var regularChinese = /[^\x00-\xff]/;
                    var errorMsg = $(input).attr("placeholder");
					if(!number){
	            		return errorMsg+"不能为空";
	            	}
					else if(new RegExp(regularChinese).test(number)){
						return errorMsg+"不能输入中文字符";
					}
	            }
			}
		},
        isFunction : function(fn) {
        	return Object.prototype.toString.call(fn)=== '[object Function]';
    	},
    	/**
		 * description:批量删除
		 * conf:
		 * {
		 * 		element:"checkbox name",
		 * 		checkAllId:"全选按钮id",
		 * 		operateId:"删除按钮id",
	     * 		elementBody:"checkbox所在的tbody",
		 * 		data:
		 * 			{
		 * 				url:"删除url",
		 * 				type:"url请求类别"
		 * 			}
		 *  }
		 * 
		 */
    	batchDelete : function(conf){
    		if(!conf.element){
				console.error("批量删除组件没有设置目标元素");
				return;
			}
    		if(!conf.checkAllId){
				console.error("批量删除组件没有设置全选按钮id");
				return;
			}
			if(!conf.operateId){
				console.error("批量删除组件没有设置删除按钮id");
				return;
			}
			if(!conf.elementBody){
				console.error("批量删除组件没有设置目标元素的tbody属性");
				return;
			}
    		if(!conf.data){
				console.error("批量删除组件没有设置数据");
				return;
			}
    		
    		var element = conf.element;
			var checkAllId = conf.checkAllId;
			var operateId = conf.operateId;
			var elementBody = conf.elementBody;
			var data = conf.data;
			
			// 全选
			$("#"+checkAllId).click(function() {
				$("input[name='"+element+"']").not(":disabled").prop("checked", this.checked);
			});
			//alert(element);
			// 单选            
			var subChk = elementBody.find("input[name='"+element+"']") 
			subChk.click(function() { 
				$("#"+checkAllId).prop("checked", subChk.length == subChk.filter(":checked").length ? true:false); 
			});
			/* 批量删除 */
			$("#"+operateId).off("click");
			$("#"+operateId).click(function() {
				// 判断是否至少选择一项
				var checkedNum = $("input[name='"+element+"']:checked").length;
				if (checkedNum == 0) {
					alert("请选择至少一项！");
					return;
				}
				// 批量选择
				if (confirm("确定要操作所选项目？")) {
					var delIndex = layer.load(); 
					var checkedList = new Array();
					$("input[name='"+element+"']:checked").each(function() {
						checkedList.push($(this).val());
					});
					var urlPath = data.url + checkedList.toString();
					var otherList = new Array();
					
					$("input[name='"+element+"']:checked").each(function() {
						var dataID = $(this).attr("data-id");
						if(dataID){
							otherList.push(dataID);
						}
					});
					if (otherList && otherList.length>0){
						urlPath += "/"+otherList.toString();
					}
					
					$.ajax({
						url : urlPath,
						type : data.type,
						data: data.param,
						success : function(result) {
							layer.close(delIndex); 
							if(result.code==200){
								layer.msg(result.msg, {shift: -1, icon:1, }, function () {
									$("[name ='"+element+"']:checkbox").attr("checked", false);
									window.location.reload();
								});
							}else{
								layer.msg(result.msg, {time: 3000, icon:5}); 
							}
						}
					});
				}
			});
    	},
    	// 批量更新
    	batchUpdate:function(conf){
    		 this.batchDelete(conf);
    	}
	};

	exports('hand', fun);
});