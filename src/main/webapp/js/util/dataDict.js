layui.define(['layer', 'form', 'hand'],function(exports) {
	var layer = layui.layer,form = layui.form();
	var hand = layui.hand;
	var longitude,latitude;

	/**
	 * 
	 * 数据字典
	 * type:默认下拉框 1.单选框 2.多选框
	 * template:你要渲染的模板
	 * key:对应sysDict表中的map_key字段
	 * exclude:需要排除的值(如果你需要排除下拉中的某个项即传入对应value值,可传入多个以逗号分隔。默认不排除)
	 * need:判断下拉列表是否需要请选择(默认为要 不为空则不要)
	 */
	
	var fun ={
			type:null,template:null,key:null,exclude:null,need:null,
			init:function(conf){
				hand.ajax({
            		url:"/dict/"+conf.key,
            		type:"get",
            		async: false,
            		success:function(data,msg) {
            			var html = "";
            			if(conf.type == 1){
                			for(var i=0; i<data.length; i++){
                				if(i == 0){
                					html += "<input type='radio' name = '"+data[i].map_key+"' title='"+data[i].label+"' value='"+data[i].value+"' checked='checked'/>";
                				}else{
                					html += "<input type='radio' name = '"+data[i].map_key+"' title='"+data[i].label+"' value='"+data[i].value+"'/>";
                				}
                			}
            			}else if(conf.type == 2){
                			for(var i=0; i<data.length; i++){
                				html += "<div class='singleChbox'><input type='checkbox' name = '"+data[i].map_key+"' value='"+data[i].value+"' lay-skin='primary'/>"+data[i].label+"</div>";
                			}
            			}else{
            				if(!conf.need){
            					html = "<option value=' '>--请选择--</option>";	
            					conf.template.html(html);
            				}
                			for(var i=0; i<data.length; i++){
                				var bool = false;
                				if(conf.exclude != undefined){
                					var items = conf.exclude.split(",");
                					for(var j=0; j<items.length; j++){
	            						if(data[i].value == items[j]){
	            							bool = true;
	            							continue;
	                					}
                					}
                				}
                				if(bool){
                					continue;
                				}
                				html += "<option value='"+data[i].value+"'>"+data[i].label+"</option>";
                			}
            			}
            			conf.template.html(html);
                    }
            	});
		},
	};

	exports('dataDict', fun);
});