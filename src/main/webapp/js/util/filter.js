layui.define([ 'layer', 'form', 'laytpl', 'laypage' ,'hand' ], function(exports) { // 提示：组件也可以依赖其它组件，如：layui.define('layer',
	// callback);
	var layer = layui.layer, form = layui.form(),
		hand = layui.hand, laytpl = layui.laytpl,
		laypage = layui.laypage;
	
	var fun = {
			/**
			 * 初始化
			 * conf:
			 * {
			 * 		title:数据展示映射---{"name":"名称","desc":"描述"}
			 * 		key  :唯一标示属性   默认-id
			 * 		initData : [{name:名称 , value:值}]
			 * 		dataUrl:数据获取的请求url
			 * 		dataParam:数据获取的请求参数
			 * 		multiple:是否允许多选(true,false)
			 * 		onSelect:function(data){}	
			 * }
			 */
			init:function(conf){
				
				var html = 		
				'<div class="table-responsive boxw text-center">'
		        +'    <table class="table table-bordered table-hover" style="text-align: center;">'
		        +'        <thead>'
		        +'        <tr class="active thead">'
		        +'        </tr>'
		        +'        </thead>'
		        +'        <tbody class="tbody">'
		        +'        </tbody>'
		        +'    </table>'
		        +'    <div class="pageDiv"></div>'
		        +'</div>'
		        +'<div class="" id="listBodyR" style="margin-top:5px; padding:15px; overflow:hidden; background:#FFF; border:1px solid #DDD;">'
		        +'</div>'
		        +'<div class="layui-form-item" style="margin-top:25px;">'
		        +'    <div class="layui-input-block rbut">'
		        +'        <button class="btn btn-pr btn-sm" id="sumbitChoose">立即提交</button>'
		        +'    </div>'
		        +'</div>';
				
				var filter = {
					title:null,initData:null,dataUrl:null,dataParam:{},multiple:null,onSelect:null,currentPage:1,key:null,
					init : function(){
						this.config();
						this.render();
						return this;
					},
					config:function(){
						this.title = conf.title;
						this.dataUrl = conf.dataUrl;
						this.key = 'key' in conf ? conf.key : "id";
						this.multiple = 'multiple' in conf ? conf.multiple : false;
						this.onSelect = 'onSelect' in conf ? conf.onSelect : function(){};
						this.initData = 'initData' in conf ? conf.initData : [];
						if(!this.title || !this.dataUrl){
							console.error("列表初始化参数不全,title:"+this.title+",dataUrl:"+this.dataUrl);
							return;
						}
						this.title.id = "唯一标示";
					},
					render:function(){
						var that = this;
						var jump = function(layero,pageNum){
							if(pageNum){
								that.dataParam.pageNum = pageNum;
							}else{
								that.dataParam.pageNum = that.currentPage;
							}
							
			    	      	hand.ajax({
			    	    		url:that.dataUrl,
			    	    		type:"get",
			    	    		data:that.dataParam,
			    	    		success:function(data,msg) {
			    	    			layero.find(".tbody").html("");
			    	    			var pageData = data.pageData;
			    	    			if(pageData){
			    	    				for(var i = 0 ; i<pageData.length;i++){
			    	    					var page = pageData[i];
			    	    					var tr = "<tr>";
			    	    					var attr = "";
			    	    					var tds = "";	
			    	    					for(t in that.title){
			    	    						attr+="data-"+t+"='"+page[t]+"' ";
			    	    						if(t == that.key){
			    	    							continue;
			    	    						}
			    	    						tds+="<td>"+page[t]+"</td>";
			    	    					}
			    	    					// data-id='"+page.id+"' data-name='"+('name' in page?page.name:page[0])+"
			    	    					tr+="<td><button type='button' class='btn btn-pr btn-sm check' "+attr+"><i class='glyphicon glyphicon-plus'></i>选择</button></td>";
			    	    					tr+=tds;
			    	    					tr+="</tr>";
			    	    					layero.find(".tbody").append(tr);
			    	    				}
			    	    				// 分页
			    	    				laypage({
			    	    					cont: layero.find(".pageDiv"),
			    	    					curr: data.pageNum,
			    	    					pages: data.totalPage,
			    	    					groups: 5,
			    	    					skip: true,
			    	    					jump: function(obj, first) {
			    	    						if (!first) {
			    	    							that.currentPage = obj.curr;
			    	    							jump(layero);
			    	    						}
			    	    					}
			    	    				});
			    	    			}
			    	    		}
			    	      	});
						}
						
						var layerIndex = layer.open({
							type: 1,
							title: '数据筛选',
							area: ['800px', '650px'],
							content: html,
							success: function (layero, index) {
								layero.find(".thead").append("<td>选择</td>");
								for(t in that.title){
									if(t == that.key){
    	    							continue;
    	    						}
									layero.find(".thead").append("<td>"+that.title[t]+"</td>");
								}
								jump(layero,1);
								var chooseDiv = layero.find("#listBodyR");
								layero.find(".tbody").on("click",".check",function(){
									var tempKey = $(this).attr("data-"+that.key);
									
									if(chooseDiv.find("[data-"+that.key+"='"+tempKey+"']").length>0){
										return;
									}
									var html = "";
									
									var attr = "";
									for(t in that.title){
										attr+="data-"+t+"='"+$(this).attr("data-"+t)+"' ";
									}
									
		                            html += "<div "+attr+" class='rls' style='float:left; margin-top:10px;'>";
		                            html += "<b class='title' style='display:inline-block;width:100px;text-align:right;'>" + $(this).attr("data-name") ? $(this).attr("data-name") : $(this).attr("data-"+that.title[0])  + "：</b>";
		                            html += "<a class='btn btn-re btn-sm' style='display:inline-block;margin-right:20px;' href='javascript:void(0);' onclick='$(this).parent().remove();'>删除</a>";
		                            html += "</div>";
		                            if(that.multiple){
		                            	chooseDiv.append(html)
		                            }else{
		                            	chooseDiv.html(html)
		                            }
								});
								
								layero.find("#sumbitChoose").on("click",function(){
									var data = [];
									chooseDiv.find("div").each(function(){
										var obj = {};
										for(t in that.title){
											obj[t] = $(this).attr("data-"+t);
										}
										data.push(obj);
									})
									if(data.length == 0){
										layer.msg("尚未选中任何数据");
										return;
									}
									that.onSelect(data);
									layer.close(layerIndex);
								})
								
								
								//初始化
								if(that.initData.length>0){
									for(var i = 0 ; i < that.initData.length ; i++){
										var d = that.initData[i];
										var html = "";
										var attr = "";
										for(t in d){
											attr+="data-"+t+"='"+d[t]+"' ";
										}
										html += "<div "+attr+" class='rls' style='float:left; margin-top:10px;'>";
			                            html += "<b class='title' style='display:inline-block;width:100px;text-align:right;'>" + d.name ? d.name : d[0]  + "：</b>";
			                            html += "<a class='btn btn-re btn-sm' style='display:inline-block;margin-right:20px;' href='javascript:void(0);' onclick='$(this).parent().remove();'>删除</a>";
			                            html += "</div>";
			                            chooseDiv.append(html)
									}
								}
				            }
						});
					}
					
					
				}
				
				return filter.init();
			}
	};

	exports('filter', fun);
});