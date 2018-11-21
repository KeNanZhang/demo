layui.define([ 'layer', 'form', 'laytpl', 'laypage' ,'hand' ], function(exports) { // 提示：组件也可以依赖其它组件，如：layui.define('layer',
	// callback);
	var layer = layui.layer, form = layui.form(),
		hand = layui.hand, laytpl = layui.laytpl,
		laypage = layui.laypage;
	var fun = {
			url:null,tpl:null,body:null,pageElement:null,condition:null,filter:null,method:null,currPageSize:null,currentPage:1,pageData:null,async:true,
			batchDel:null,tableAsync:null,
			/**
			 * 初始化
			 * conf:
			 * {
			 * 		url:列表页面数据地址
			 * 		tpl:模板字符串
			 * 		body:数据渲染对象(jquery对象)
			 * 		pageElement:分页组件渲染元素(元素ID)
			 * 	 	operateType:操作类型(暂时使用'delete'使用特殊操作)
			 * 		condition:查询条件(json对象)
			 * 		method:函数定义
			 * 		filter:数据过滤function(fieldName,fieldValue)	return	你想设置的值
			 * }
			 */
			init:function(conf){
				this.url = conf.url;
				this.tpl = conf.tpl;
				this.body = conf.body;
				this.tableAsync = conf.tableAsync;
				this.async = 'async' in conf ? conf.async : true;
				this.pageElement = conf.pageElement;
				this.operateType = 'operateType' in conf ? conf.operateType : "";
				this.method = 'method' in conf ? conf.method : {};
				this.batchDel = 'batchDel' in conf ? conf.batchDel : null;
				this.filter = 'filter' in conf ? conf.filter : function(){};
				if(!hand.isFunction(this.filter)){
                    this.filter = this.method[this.filter];
                    if(!this.filter){
                        this.filter =function(){};
					}
				}
				this.condition = 'condition' in conf ? conf.condition:{};
				if(!this.url || !this.tpl || !this.body || !this.pageElement){
					console.error("列表初始化参数不全,url:"+this.url+",tpl:"+this.tpl+",body:"+this.body+",pageElement:"+this.pageElement);
					return;
				}
				this.jump();
				return this;
			},
			//跳转页面
			jump:function(pageNum){
				var that = this;
				if(pageNum){
					this.condition.pageNum = pageNum;
				}else{
					this.condition.pageNum = this.currentPage;
				}
				$("#allChk").removeAttr("checked");
    	      	hand.ajax({
    	    		url:this.url,
    	    		type:"post",
    	    		data:this.condition,
    	    		async:this.async,
    	    		success:function(data,msg) {
                        if (data == null) {
                        	var html = "<div class='layui-form-label widths'>"+msg+"</div>";
                            that.body.html(html);
                        } else {

                            that.pageData = data.pageData;
                            //数据过滤
                            if (that.pageData && that.pageData.length > 0) {
                                for (var i = 0; i < that.pageData.length; i++) {
                                    var d = that.pageData[i];
                                    for (var field in d) {

                                        var filterValue = that.filter(field, d[field]);
                                        if (filterValue) {
                                            d[field] = filterValue;
                                        }
                                    }
                                }
                            }

                            laytpl(that.tpl).render(data, function (html) {
                                that.body.html(html);
                                that.eventBind();
                                that.currPageSize = 0;
                                if (data.pageData) {
                                    that.currPageSize = data.pageData.length;
                                }

                                if(that.operateType != undefined && that.operateType != ""){//删除操作：跳转到当前页没数据的bug

                                    if(that.pageData.length<= 0){
                                        that.condition.pageNum= data.pageNum -1;
                                        fun.del();
                                    }
								}

                                // 分页
                                laypage({
                                    cont: that.pageElement,
                                    curr: data.pageNum,
                                    pages: data.totalPage,
                                    groups: 5,
                                    skip: true,
                                    jump: function (obj, first) {
                                        if (!first) {
                                            that.currentPage = obj.curr;
                                            that.operateType = "";
                                            that.jump();
                                        }

                                    }
                                });
                                //if(data.dataCount>data.pageSize)
                                var html = "<label class='layui-form-label widths'>总共&nbsp;&nbsp;<b style='color: #00a2d4' class='pageCount'>" + data.dataCount + "</b>&nbsp;&nbsp;条记录</label>";
                                $("#" + that.pageElement).append(html);
                                
                                if(that.batchDel){
                                	hand.batchDelete(that.batchDel);
                                }
                            });   
                            if(that.tableAsync!=null){
                         	   that.tableAsync(that);
                            }
                        }
                        that.sort();
                    }
    	      	});
			},
        	del:function(){
                fun.condition.operateType="";
                fun.jump(fun.condition.pageNum);
			},
			//修改配置信息
			config:function(conf){
				if('url' in conf){
					this.url = conf.url;
				}
				if('tpl' in conf){
					this.tpl = conf.tpl;
				}
				if('body' in conf){
					this.body = conf.body;
				}
				if('pageElement' in conf){
					this.pageElement = conf.pageElement;
				}
				if('condition' in conf){
					this.condition = conf.condition;
				}
			}
			//事件绑定
			,eventBind : function(){
				var that = this;
				this.body.find("[on-click]").on("click",function(){
					that.method[$(this).attr("on-click")]($(this));
                 });
			},
			tableAsyncEventBind : function(e){
				var that = this;
				e.on("click",function(){
					that.method[e.children().attr("on-click")](e.children());
                 });
			}
			,dataInit : function(element , data){
				for(var d in data){
					var value = data[d];
					var ele = element.find("[name='"+d+"']");
					ele.val(value);
				}
				
				form.render();
			}
			//排序
			,sort:function(){				
				var th = $('table thead th.sort');
				var tbody = $('table tbody');
				var td = $('tbody tr');	
				for(var i = 0;i < th.length;i++){	
					if($(th[i]).find('.layui-table-sort').length == 0){
						$(th[i]).append('<span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc"></i><i class="layui-edge layui-table-sort-desc"></i></span>');
					}
				  
//				  $(th[i]).find('.layui-table-sort-asc').click(function(){
//					  var that = $(this).parents('th');
//					 $(this).parent().attr('lay-sort','asc');
//				    sort(that.attr('data-type'),1,that.index());
//				  });
//				  
//				  $(th[i]).find('.layui-table-sort-desc').click(function(){
//					  var that = $(this).parents('th');
//					  $(this).parent().attr('lay-sort','desc');
//				    sort(that.attr('data-type'),-1,that.index());
//				  });
				};
				$('thead').off('click');
				$('thead').on('click','.layui-edge',function(){
					var that = $(this).parents('th');
					if($(this).hasClass('layui-table-sort-asc')){
						sort(that.attr('data-type'),1,that.index());
					}else{
						sort(that.attr('data-type'),-1,that.index());
					}
				})
				function sort(str,flag,n){
				  var arr = [];
				  for(var i = 0;i < td.length;i++){
				    arr.push(td[i]);
				  };				  
				  arr.sort(function(a,b){
				    return method(str,a.cells[n].innerHTML,b.cells[n].innerHTML) * flag;
				  });
				  for(var i = 0;i < arr.length;i++){
				    tbody.append(arr[i]);
				  };
				};
				function method(str,a,b){
				  switch(str){
				  case 'num': 
				    return a-b;
				    break;
				  case 'string': 
				    return a.localeCompare(b);
				    break;
				  default:
				    return new Date(a.split('-').join('/')).getTime()-new Date(b.split('-').join('/')).getTime();
				  };
				};
				
			}
	};

	exports('list', fun);
});