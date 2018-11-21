layui.define(['layer', 'form', 'hand'],function(exports) { // 提示：组件也可以依赖其它组件，如：layui.define('layer',
									// callback);
	var layer = layui.layer,form = layui.form();
	var hand = layui.hand;
	
	var tipOption = "<option value='0'>请选择</option>";
    var selectText = "";//用于保存选中的文本值
    var arr = new Array();//用于保存选中的值(仅用于文本框赋值)

	var fun ={
		
		/**
		 * conf:
		 * {
		 * 		element:"目标元素",
		 * 		name:"级联唯一标示",
		 * 		valueElementName:"用于保存最终选中的值",
		 * 		mapping:{
		 * 			value:值属性标识(默认:id)
		 * 			code:编码属性标识(默认:code)
		 * 			name:名称属性标识(默认:name)
		 * 		}
		 * 		data:[
		 * 				{
		 * 					url:"第一级数据来源url",
		 * 					filter:{
         *           			id:"需要过滤的数据id"
         *           		}
		 * 				}
		 * 				,
		 * 				{
		 * 					url:"第二级数据来源url",
		 * 				}
		 * 				,
		 * 				{
		 * 					url:"第三级数据来源url"
		 * 				}
		 * 			 ],
		 * 		restore:{
		 * 			 方案一：
		 * 			initValue:[第一级数据,第二级数据,第三级数据,...]
		 * 
		 * 			 方案二：
		 *       	 url:"还原数据来源url",
         *  		 zoneSelectedID: 还原数据id,
         *  		 levelScope:当前级别的值为2,3,4
		 *      },
		 *      extraProperty:额外属性:获取select选中的值 追加到该元素
		 * }
		 * 
		 */
		init : function(conf){
			
			if(!conf.data || conf.data.length<=0){
				console.error("关联组件没有设置数据");
				return;
			}
			
			if(!conf.element){
				console.error("关联组件没有设置目标元素");
				return;
			}
			if(!conf.name){
				console.error("关联组件没有设置名称");
				return;
			}
			if(!conf.valueElementName){
				console.error("关联组件没有设置存值元素");
				return;
			}
			
			var selectArray = [];
			//清空数组
			selectArray.splice(0,selectArray.length);
			
			var element = conf.element;
			var name = conf.name;
			var valueElementName = conf.valueElementName;
			
			//初始化区域(还原数据)
			var restore = 'restore' in conf ? conf.restore : {};
			var zoneSelectedID = 'zoneSelectedID' in restore ? restore.zoneSelectedID : "";
			var restoreUrl = 'url' in restore ? restore.url : "";
			var levelScope = 'levelScope' in restore ? restore.levelScope : "0,1,2";
			var initValue = 'initValue' in restore ? restore.initValue : [];
			var selectIDs = [];
			
			var mapping = 'mapping' in conf ? conf.mapping : {value:"id",code:"code",name:"name"};
            var extraProperty = 'extraProperty' in conf ? conf.extraProperty : "";
			
			var relationData = conf.data;
			
			//屏蔽数据
			var filter;
			var idFilter;
			var idFilterArr = new Array();
			
			for(var i = 0 ; i < relationData.length ; i++){
				var select = $("<select name='"+name+i+"' lay-filter='"+name+i+"'></select>");
				select.append(tipOption);
				element.append(select);
				selectArray.push(select);
				
				filter = 'filter' in relationData[i] ? relationData[i].filter : {};
				idFilter = 'id' in filter ? ","+filter.id+"," : "";
				var param = {};
				param.level = i;
				param.id = idFilter;
				idFilterArr.push(param);

                select.next("div").children("dl").on("click",function(){
                    alert(3333);
                })
			}

			if(zoneSelectedID!=""){
				restoreData(); 
			}
			
			//初始化存值元素
			var valueElementIDInput = $("<input id='"+valueElementName+"ID' name='"+valueElementName+"ID' placeholder='所属区域' type='hidden' lay-verify='requiredPlus' ></input>")
			var valueElementCodeInput = $("<input id='"+valueElementName+"Code' name='"+valueElementName+"Code' placeholder='所属区域' type='hidden' lay-verify='requiredPlus' ></input>")
			var valueElementFullInput = $("<input  id='"+valueElementName+"Full' name='"+valueElementName+"Full' placeholder='所属区域' type='hidden' lay-verify='requiredPlus' ></input>")
			//初始化第一级别的数据
			var firstLevel = relationData[0];
			//初始化该级别数据
			var firstLevelData = initData(firstLevel.url,firstLevel.relativeID);
			render(firstLevelData,0);
			
			if(selectIDs.length > 0){
				var j= 0 ;
				for (var i = 0; i < selectIDs.length; i++) {
					var selectID = selectIDs[i];
					if(selectID!=null&&levelScope&&(","+levelScope+",").indexOf((","+selectID.level+",")) != -1){
						selectArray[j++].next("div").eq(0).find("dd[lay-value='"+selectID.id+"']").trigger("click");
					}
				}
            }
			
			if(initValue.length > 0){
				for(var i = 0 ; i<initValue.length ; i++){
					selectArray[i].next("div").eq(0).find("dd[lay-value='"+initValue[i]+"']").trigger("click");

				}
			}
            function OnInput (event) {
                alert ("The new content: " + event.target.value);
            }
            function OnPropChanged (event) {
                if (event.propertyName.toLowerCase () == "value") {
                    alert ("The new content: " + event.srcElement.value);
                }
            }
			//____________
			
			function render(levelData,level){
				element.append(valueElementIDInput);
				element.append(valueElementCodeInput);
				element.append(valueElementFullInput);



				if(level>=relationData.length){
					return;
				}
				
				var option = tipOption;
	            for (var i = 0; levelData!=undefined&&i < levelData.length; i++) {
	            	if(idFilterArr.length == 0){//无过滤数据
	            		option += "<option code='"+(levelData[i])[mapping.code]+"' value='"+(levelData[i])[mapping.value]+"'>"+(levelData[i])[mapping.name]+"</option>";
	            	}else{
		            	var proID = ","+levelData[i].id+",";
	            		for (var j = 0; j < idFilterArr.length; j++) {//过滤数据
	            			if(idFilterArr[j].level == level){
	            				if(idFilterArr[j].id == "" || idFilterArr[j].id.indexOf(proID) == -1){
	            					option += "<option code='"+(levelData[i])[mapping.code]+"' value='"+(levelData[i])[mapping.value]+"'>"+(levelData[i])[mapping.name]+"</option>";
	            				}
	            			}
	            		}
	            	}
				}
	            selectArray[level].html(option);


	          //该级别的级联操作
	            form.on('select('+name+level+')', function(data){
                    if(extraProperty != ""){//将选中的值追加到文本框
                    	
                    	//step1:获取选中的值
						if(level == 0){
							selectText = "";
							arr.splice(0,arr.length);
						}
                    	selectText = $(data.elem).find("option:selected").text();
                    	
                    	//step2:判断选中的值level在数组中是否有相同level的值
                    	for (var i = 0; i < arr.length; i++) {
							var val = arr[i].level;
							if(level == val){
								arr = $.grep(arr,function(n,i){
									return n.level < level;
								});
							}
						}
                    	
                    	//step3:往数组中填充值
                        var param = {};
                    	param.level = level;
                    	param.value = selectText;
                    	arr.push(param);
                    	
                    	//step4:数组排序
                    	arr.sort(compare('level'));
                    	
                    	//step5:赋值
                    	var text = "";//用户保存最终的值(仅用于文本框赋值)
                    	for (var i = 0; i < arr.length; i++) {
                    		text += arr[i].value;
                    	}
                        $(extraProperty).val(text);
                    }


	            	//清空
	            	clear(level);
	            	
	            	if(data.value == 0 && level>0){
	            		var preSelect = selectArray[level-1];
	            		valueElementIDInput.val(preSelect.val());
	            		valueElementCodeInput.val(preSelect.find("option:selected").attr("code"));
	            		
	            		var full = "";
	            		for(var i =0 ; i <= level-1 ; i++){
	            			full+=selectArray[i].find("option:selected").text();
	            		}
	            		valueElementFullInput.val(full);
	            	}else{
	            		valueElementIDInput.val(data.value);
	            		valueElementCodeInput.val(selectArray[level].find("option[value='"+data.value+"']").attr("code"));
	            		
	            		var full = "";
	            		for(var i =0 ; i <= level ; i++){
	            			full+=selectArray[i].find("option:selected").text();
	            		}
	            		valueElementFullInput.val(full);
	            	}
	            	if(data.value > 0){
	            		if(level+1>=relationData.length){
	            			return;
	            		}
	            		var currentLevelData = initData(relationData[level+1].url,data.value);
	            		render(currentLevelData,level+1);
	            	}

	            });
	            form.render();
	            
			}
			
			//数组排序
			function compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
			}
			
			//清空某级别以下地域组件数据
            function clear(level){
            	for (var i = 1; i <= relationData.length; i++) {
					if(level <= i){
						if(level+i < relationData.length){
							selectArray[level+i].html(tipOption);
						}
					}
				}
            	form.render();
            }
            
			//获取数据
			function initData(url,relativeID){
				if(!url){
					console.error("url没有设置");
					return;
				}
				return loadData(url,{relativeID:relativeID})
			}
			
			function restoreData(){
				var relativeParam = {};
				relativeParam.relativeID = zoneSelectedID;
				hand.ajax({
					url:restoreUrl, 
            		type:"get",
            		data:relativeParam,
            		async:false,
            		success:function(data, msg) {
            			for (var i = 0; data!=undefined&&i < data.length; i++) {
            				selectIDs.push(data[i]);
            			}
            		}
				});
				if(!selectIDs){
					console.info("初始化区域失败，系统不存在该区域")
				}
			}
			
			function loadData(url , param){
				var resource;
				hand.ajax({
					url:url, 
            		type:"get", 
            		data : param,
            		async:false,
            		success:function(data, msg) {
            			if(data){
            				resource = data;
                      	}
	        		}
				});
				return resource;
			}
			
		}
		
	};

	exports('relation', fun);
});