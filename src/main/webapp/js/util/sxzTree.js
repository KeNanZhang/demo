layui.define([ 'layer','hand','element' ], function(exports) { // 提示：组件也可以依赖其它组件，如：layui.define('layer',
	// callback);
	var layer = layui.layer,hand = layui.hand;
	var element = layui.element();
	
	var fun = {
			/**
			 * 初始化
			 * conf:
			 * {
			 * 
			 * mode:  1.加载数据线(将容器class设为ztree) 默认是在tab中加载树
			 * dataLineID: 数据线ID
			 * dataLineType: 数据线类型 0:根据数据线ID返回所有数据 1:根据数据线ID返回监管对象 2:返回从自身开始的监管对象 
			 * onClick: 鼠标点击节点时触发
			 * 
			 * 
			 * url: 请求路径
			 * type: 请求类型
			 * name: 节点显示的文本,放入实体类中相应的字段即可
			 * treeModel: tab页下的容器ID
			 * async: 是否异步加载 不传值默认非异步加载，true为异步加载
			 * asyncUrl: 你需要加载的路径。[setting.async.enable = true 时生效]
			 * dataFilter: 用于对 Ajax 返回数据进行预处理的函数。[setting.async.enable = true 时生效] 具体细节访问zTree文档
			 * filter: tab容器中lay-filter=""的属性值  非常重要
			 * addHoverDom: 用于当鼠标移动到节点上时，显示用户自定义控件
			 * removeHoverDom: 用于当鼠标移出节点时，隐藏用户自定义控件
			 * 注:
			 * 返回的msg是当前tab的位置  不传默认第一页
			 * 
			 * }
			 */
			mode:null,dataLineID:null,dataLineType:null,url:null,type:null,name:null,treeModel:null,async:null,asyncUrl:null,dataFilter:null,filter:null,addHoverDom:null,removeHoverDom:null,
			
			init:function(conf){
				if(conf.mode == 1){
					if(!conf.dataLineID){
						console.error("请设置dataLineID属性");
						return;
					}
					hand.ajax({
						async:false,
	    				url:"/dataLineItemRole/selectByLineID/" + conf.dataLineID + "/" + conf.dataLineType,
	    				type:"get",
	    				success:function(data,msg){
							var key;
							if(conf.dataLineType == 2){
								 for(var k in data){
										key = k;
								 }
							}else{
								key = conf.dataLineID;
							}
							if(!key){
								layer.msg('没有找到关联的下级单位', {time: 3000, icon:5});
								return;
							}
							var line = data[key];
							//过滤掉line中的isParent属性 该属性和zTree内部属性冲突
							var tpLine = [];
							for(var m in line){
								var obj = line[m];
								delete obj["isParent"];
								//添加regionLevel  ztree的关键字段包含level
								obj.regionLevel = obj["level"];
								tpLine.push(obj);
							}
							line = tpLine;
							var setting = {
								data: {
									key: {
										name: "dataName"
									},
									simpleData: {
										enable: true,
										idKey: "id",
										pIdKey: "parentID",
										rootPId: -1
									}
								},
								callback: {
									onClick: conf.onClick,
									beforeDrag: false
								}
							};
							$.fn.zTree.init($(".ztree"), setting,line);
	    				}
	    			})
				}else{
					var async = false;
					if(conf.async == 'true'){
						 async = true;
					}
	    			hand.ajax({
	    				url:conf.url,
	    				type:conf.type,
	    				success:function(data,msg){
	    					var index = 0;
	    					for(var title in data){
	    						index++;
	    						var treeDatas = data[title];
	    						for(var title in treeDatas){
	    							var treeData = treeDatas[title];
		    						 var setting = {
		    								  async: {
		    									    enable: async,
		    									    url:conf.asyncUrl,
		    										autoParam:["id"],
		    										dataFilter: conf.dataFilter
		    									},
		    					    			view: {
		    					    				selectedMulti: false,
		    					    				addHoverDom: conf.addHoverDom,
		    	            						removeHoverDom: conf.removeHoverDom
		    					    			},
		    					    			edit: {
		    					    				enable: true,
		    					    				showRemoveBtn: false,
		    					    				showRenameBtn: false
		    					    			},
		    					    			data: {
		    					    				keep: {
		    					    					parent:true,
		    					    					leaf:false
		    					    				},
		    					    				key: {
		    											name: conf.name
		    										},
		    					    				simpleData: {
		    											enable: true,
		    											idKey: "id",
		    											pIdKey: "parentID",
		    											rootPId: -1
		    										}
		    					    			},
		    					    			callback: {
		    					    				beforeDrag: fun.zTreeBeforeDrag
		    					    			}
		    					    		};
		    					     
		    					        
		    						var modelClone = $(treeModel).clone(false);
		            				modelClone.find(".ztree").attr("id","tree"+index);
		            				modelClone.find(".confirm").attr("data-treeId","tree"+index);
		            				var html = modelClone.html();
		            				element.tabAdd(conf.filter, {
		            					id   : index,
		            					title: title,
		            					content: html //支持传入html
		            				});
		            				
		            				$.fn.zTree.init($("#tree"+index), setting,treeData);
		            				var zTree = $.fn.zTree.getZTreeObj("tree"+index);
		            				if(async){ // 异步加载折叠全部节点
		            					zTree.expandAll(false);
		            				}else{ // 非异步展开全部节点
		            					zTree.expandAll(true);
		            				}
		            				
	            			}
	    					
	    					  var reg = /^[0-9]+.?[0-9]*$/;
	    					  if (reg.test(msg)) { // 这里的msg是定位到当前的tab页签
	    						 element.tabChange(conf.filter, msg); 
	    					  }else{
	    						  element.tabChange(conf.filter, 1);
	    					  }
	    					  	 
	    					}
	    				}
	    			})
				}
			},
			zTreeBeforeDrag : function(treeId, treeNodes){
				 return false;
			}
	};

	exports('sxzTree', fun);
});