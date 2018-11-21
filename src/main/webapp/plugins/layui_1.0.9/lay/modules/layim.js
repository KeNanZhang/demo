/**

 @Name：layim v3.6.0 Pro 商用版
 @Author：贤心
 @Site：http://layim.layui.com
 @License：LGPL
    
 */

layui.define(['layer', 'laytpl', 'upload', 'flow'], function(exports){
  
  var v = '智慧安全基础版1.0';
  var $ = layui.jquery;
  var layer = layui.layer;
  var laytpl = layui.laytpl;
  var device = layui.device();
  var flow = layui.flow;
  var SHOW = 'layui-show', THIS = 'layim-this', MAX_ITEM = 20;
  var friendPageNum = 1,myPageNum = 1;
  //回调
  var call = {};
  
  //对外API
  var LAYIM = function(){
    this.v = v;
    $('body').on('click', '*[layim-event]', function(e){
      var othis = $(this), methid = othis.attr('layim-event');
      events[methid] ? events[methid].call(this, othis, e) : '';
    });
  };
  
  
  //基础配置
  LAYIM.prototype.config = function(options){
    var skin = [];
    layui.each(Array(5), function(index){
      skin.push(layui.cache.dir+'css/modules/layim/skin/'+ (index+1) +'.jpg')
    });
    options = options || {};
    options.skin = options.skin || [];
    layui.each(options.skin, function(index, item){
      skin.unshift(item);
    });
    options.skin = skin;
    options = $.extend({
      isfriend: !0
      ,isgroup: !0
      ,voice1: 'default.mp3'
      ,voice2: 'warning.mp3'
    }, options);
    if(!window.JSON || !window.JSON.parse) return;
    init(options);
    return this;
  };
  
  //监听事件
  LAYIM.prototype.on = function(events, callback){
    if(typeof callback === 'function'){
      call[events] ? call[events].push(callback) : call[events] = [callback];
    }
    return this;
  };

  //获取所有缓存数据
  LAYIM.prototype.cache = function(){
    return cache;
  };
  
  //打开一个自定义的会话界面
  LAYIM.prototype.chat = function(data){
    if(!window.JSON || !window.JSON.parse) return;
    return popchat(data), this;
  };
  
  //设置聊天界面最小化
  LAYIM.prototype.setChatMin = function(){
    return setChatMin(), this;
  };
  
  //设置当前会话状态
  LAYIM.prototype.setChatStatus = function(str){
    var thatChat = thisChat();
    if(!thatChat) return;
    var status = thatChat.elem.find('.layim-chat-status');
    return status.html(str), this;
  };
  
  //接受消息
  LAYIM.prototype.getMessage = function(data){
    return getMessage(data), this;
  };
  
  //桌面消息通知
  LAYIM.prototype.notice = function(data){
    return notice(data), this;
  };
  
  //打开添加好友/群组面板
  LAYIM.prototype.add = function(data){
    return popAdd(data), this;
  };
  
  //好友分组面板
  LAYIM.prototype.setFriendGroup = function(data){
    return popAdd(data, 'setGroup'), this;
  };
  
  //消息盒子的提醒
  LAYIM.prototype.msgbox = function(nums){
    return msgbox(nums), this;
  };
  
  //添加好友/群
  LAYIM.prototype.addList = function(data){
    return addList(data), this;
  };
  
  //删除好友/群
  LAYIM.prototype.removeList = function(data){
    return removeList(data), this;
  };
  
  //设置好友在线/离线状态
  LAYIM.prototype.setFriendStatus = function(id, type){
    var list = $('.layim-friend'+ id);
    list[type === 'online' ? 'removeClass' : 'addClass']('layim-list-gray');
  };

  //解析聊天内容
  LAYIM.prototype.content = function(content){
    return layui.data.content(content);
  };


  //主模板
  var listTpl = function(options){
    var nodata = {
      friend: "该分组下暂无好友"
      ,group: "暂无群组"
      ,history: "暂无历史会话"
    };

    options = options || {};
    options.item = options.item || ('d.' + options.type);

    return ['{{# var length = 0; layui.each('+ options.item +', function(i, data){ length++; }}'
      ,'<li layim-event="chat" data-type="'+ options.type +'" data-index="{{ '+ (options.index||'i') +' }}" class="layim-'+ (options.type === 'history' ? '{{i}}' : options.type + '{{data.id}}') +' {{ data.status === "offline" ? "layim-list-gray" : "" }}"><img src="{{ data.avatar }}"><span>{{ data.username||data.groupname||data.name||"佚名" }}</span><p>{{ data.remark||data.sign||"" }}</p><span class="layim-msg-status">new</span></li>'
    ,'{{# }); if(length === 0){ }}'
      ,'<li class="layim-null">'+ (nodata[options.type] || "暂无数据") +'</li>'
    ,'{{# } }}'].join('');
  };
  

  var elemTpl = ['<div id="demo" class="layui-layim-main">'
    ,'<div class="layui-layim-info">'
      ,'<div class="layui-layim-user">{{ d.mine.username }}</div>'
      ,'<div class="layui-layim-status">'
        ,'{{# if(d.mine.status === "online"){ }}'
        ,'<span class="layui-icon layim-status-online" layim-event="status" lay-type="show">&#xe617;</span>'
        ,'{{# } else if(d.mine.status === "hide") { }}'
        ,'<span class="layui-icon layim-status-hide" layim-event="status" lay-type="show">&#xe60f;</span>'
        ,'{{# } }}'
        ,'<ul class="layui-anim layim-menu-box">'
          ,'<li {{d.mine.status === "online" ? "class=layim-this" : ""}} layim-event="status" lay-type="online"><i class="layui-icon">&#xe618;</i><cite class="layui-icon layim-status-online">&#xe617;</cite>在线</li>'
          ,'<li {{d.mine.status === "hide" ? "class=layim-this" : ""}} layim-event="status" lay-type="hide"><i class="layui-icon">&#xe618;</i><cite class="layui-icon layim-status-hide">&#xe60f;</cite>隐身</li>'
        ,'</ul>'
      ,'</div>'
    ,'</div>'
    ,'<ul class="layui-unselect layui-layim-tab{{# if(!d.base.isfriend || !d.base.isgroup){ }}'
      ,' layim-tab-two'
    ,'{{# } }}">'

	  ,'<li  id="message" class="layui-icon layim-this" title="消息" layim-event="tab" lay-type="history">&#xe611;</li>'
	  
	  ,'<li class="layui-icon'
      ,'{{# if(!d.base.isfriend){ }}'
      ,' layim-hide'
      ,'{{# } else if(!d.base.isgroup) { }}'
      ,' layim-this'
      ,'{{# } }}'
      ,'" title="好友" layim-event="tab" lay-type="friend">&#xe612;</li>'
      
      ,'<li id="interaction" class="layui-icon tabHd" title="互动" layim-event="tab" lay-type="group">&#xe63a;</li>'
    ,'</ul>'
    
	
	,'<ul class="layui-unselect layim-tab-content {{# if(d.base.isfriend){ }}layui-show{{# } }}">'
      ,'<li>'
        ,'<ul class="layui-layim-list layui-show layim-list-history">'
        ,listTpl({
          type: 'history'
        })
        ,'</ul>'
      ,'</li>'
    ,'</ul>'
	
	,'<ul class="layui-unselect layim-tab-content {{# if(!d.base.isfriend && d.base.isgroup){ }}layui-show{{# } }} layim-list-friend">'
    ,'{{# layui.each(d.friend, function(index, item){ var spread = d.local["spread"+index]; }}'
      ,'<li>'
        ,'<h5 layim-event="spread" lay-type="{{ spread }}"><i class="layui-icon">{{# if(spread === "true"){ }}&#xe61a;{{# } else {  }}&#xe602;{{# } }}</i><span>{{ item.groupname||"未命名分组"+index }}</span><em>(<cite class="layim-count"> {{ (item.list||[]).length }}</cite>)</em></h5>'
        ,'<ul class="layui-layim-list {{# if(spread === "true"){ }}'
        ,' layui-show'
        ,'{{# } }}">'
        ,listTpl({
          type: "friend"
          ,item: "item.list"
          ,index: "index"
        })
        ,'</ul>'
      ,'</li>'
    ,'{{# }); if(d.friend.length === 0){ }}'
      ,'<li><ul class="layui-layim-list layui-show"><li class="layim-null">暂无联系人</li></ul>'
    ,'{{# } }}'
    ,'</ul>'
    
	
	//互动交流
	,'<ul class="layui-unselect layim-tab-content {{# if(!d.base.isfriend && d.base.isgroup){ }}layui-show{{# } }}" style="position:relative;">'
		,'<li id="hdAllInfo">'
			,'<ul class="hdAll">'
				,'<li id="my" layim-event="" data-type="" data-index="0" class="hdsrc"><a href="javascript:;">与我有关</a></li>'
			    ,'<li class="hlis">'
					,'<ul id="allInfo" class="layui-layim-hdlist layui-show layim-list-interactive">'
					
					,'</ul>'
		      	 ,'</li>'
	      	,'</ul>'
		,'</li>'
		,'<li id="hdMyInfo">'
			,'<ul class="hdAll">'
				,'<li layim-event="" data-type="" data-index="0" class="hdtit">与我有关<a href="javascript:;" class="gobackAll">返回</a></li>'
			    ,'<li class="hlis">'
					,'<ul id="myInfo" class="layui-layim-hdlist layui-show layim-list-interactive"> '
					
					,'</ul>'
		      	 ,'</li>'
	      	,'</ul>'
		,'</li>'
		
      	 
      	,'<li class="htxt ebox hdAll">'
			,'<ul class="layui-layim-hdlist layui-show layim-list-interactive" style="max-height:345px; margin-bottom:0;"  id="findHuihu">'
				 /* ,'<li layim-event="" data-type="" data-index="0" class="layim-group101">'
						,'<img src="http://tp2.sinaimg.cn/2211874245/180/40050524279/0"><span>中电数通科技有限公司 小明</span><p>2017-08-28 10:20</p><b>消防安全检查的内容是什么？</b><p class="replyA"><a href="javascript:;">回复</a></p>'
						,'<p class="retxt"><textarea class="form-control" rows="2" placeholder="输入回复内容"></textarea><button type="button" class="btnE">提交</button></p>'
				  ,'</li>'
				  ,'<li layim-event="" data-type="" data-index="0" class="layim-group101">'
						,'<img src="http://tp2.sinaimg.cn/2211874245/180/40050524279/0"><span>巨银物业 小李</span><p>2017-08-28 10:20</p><p>回复：中电数通科技有限公司 小明</p><p class="rptxt">（1）查领导，看对消防安全工作的重视程度；（2）查思想，看消防安全工作的行动；（3）查组织，看消防活动情况和发挥的作用；（4）查制度，看消防安全制度是否落到实处；（5）查火源，看用火、用电是否符合要求；（6）查物资，看储存的数量、环境是否恰当；（7）查建筑，看设计是否符合规范要求；（8）查隐患，看是否进行了整改或已采取有效安全措施；（9）查消防设施，看设备是否齐全，装备是否完好；（10）查火灾事故，看是否作出了处理或处理是否妥当。</p><p class="replyA"><a href="javascript:;">回复</a></p>'
				  ,'</li>'
				  ,'<li class="prevL"><a href="javascript:;"><i class="layui-icon">&#xe603;</i></a></li>'*/
			,'</ul>'
	  	 ,'</li>'
		 ,'<li layim-event="" data-type="" data-index="0" class="addhd hdAll"><a href="javascript:;"><i class="layui-icon">&#xe608;</i> 创建</a></li>'
		 ,'<li class="hadd ebox hdAll" style="display:none;">'
		 ,'<p class="prevL"><a href="javascript:;"><i class="layui-icon">&#xe603;</i></a></p>'
				,'<div class="hdtab_tit">'
					,'<span id="hdtab_1" class="hover">创建互动消息</span>' 
				,'</div>'
				,'<div class="hdtab" id="con_hdtab_1">'
					,'<textarea id="interactionTitle" maxlength="20" class="form-control" rows="3" placeholder="标题：写下你的问题" lay-verify="title"></textarea>'
					,'<textarea id="interactionContent" class="form-control" rows="5" placeholder="详细说明你的问题"></textarea>'
					,'<button id="submitInteraction" type="button" class="btnA">提交</button>'
				,'</div>'
				,'<div class="hdtab" id="con_hdtab_2">'
					,'<p class="tinp"> </p>'
					/*,'<textarea class="form-control" rows="3" placeholder="标题：写下你的问题"></textarea>'*/
					,'<textarea id="noticeContent" class="form-control" rows="5" placeholder="详细说明你的问题"></textarea>'
					,'<button id="submitNotice" type="button" class="btnA">提交</button>'
				 ,'</div>'
			 /*,'<h2>创建互动消息</h2>'
			 ,'<textarea class="form-control" rows="3" placeholder="标题：写下你的问题"></textarea>'
			 ,'<textarea class="form-control" rows="5" placeholder="选填，详细说明你的问题"></textarea>'
			 ,'<button type="button" class="btnA">提交</button>'*/
		 ,'</li>'
    ,'</ul>'
	
    ,'<ul class="layui-unselect layim-tab-content">'
      ,'<li>'
        ,'<ul class="layui-layim-list layui-show" id="layui-layim-search"></ul>'
      ,'</li>'
    ,'</ul>'
    ,'<ul class="layui-unselect layui-layim-tool">'
      ,'<li class="layui-icon layim-tool-search" layim-event="search" title="搜索">&#xe615;</li>'
      ,'{{# if(d.base.msgbox){ }}'
      ,'<li class="layui-icon layim-tool-msgbox" layim-event="msgbox" title="消息盒子">&#xe645;<span class="layui-anim"></span></li>'
      ,'{{# } }}'
      ,'{{# if(d.base.find){ }}'
      ,'<li class="layui-icon layim-tool-find" layim-event="find" title="查找">&#xe608;</li>'
      ,'{{# } }}'
      ,'<li class="layui-icon layim-tool-skin" layim-event="skin" title="更换背景">&#xe61b;</li>'
      ,'{{# if(!d.base.copyright){ }}'
      ,'<li class="layui-icon layim-tool-about" layim-event="about" title="关于">&#xe60b;</li>'
      ,'{{# } }}'
    ,'</ul>'
    ,'<div class="layui-layim-search"><input><label class="layui-icon" layim-event="closeSearch">&#x1007;</label></div>'
  ,'</div>'].join('');

var stats = null; 

$(function(){
	$('body').on("click","#interaction",function(){
		friendPageNum = 1;
		myPageNum = 1;
		// 加载所有好友的互动信息
		setTimeout(function(){
			 var obj=$("body #allInfo");
			flow.load({
				elem: '#allInfo' //流加载容器
					,scrollElem:  '#allInfo' 
					,isAuto : 'true'
					,done: function(page, next){ //执行下一页的回调
					      setTimeout(function(){
					    	 var param = {};
					 		 param.pageNum = friendPageNum;
					 		 param.infoType = 1;
					    	  $.ajax({
					    		  url:"/chat/selectMessage",
						    		type:"get",
						    		data:param,
						    		async: false,//改为同步
						    		success:function(data) {
						    			if(data.data.pageData != null){
						    				var interactionInfo = "";
							    			for (var i = 0; i < data.data.pageData.length; i++) {
							    				var message = data.data.pageData[i];
							    				interactionInfo += '<li layim-event="" data-id="'+message.id+'" data-index="0" class="layim-group101">';
							    				var sb="";
							    				if(message.unitName.trim().length!=0){
							    					sb = message.unitName+' — '+message.userName;
							    				}else{
							    					sb = message.userName;
							    				}
							    				interactionInfo += '<div class="fl"><img src="'+message.avatar+'"></div><div class="fl"><span style="display:inline-block;max-width:170px;white-space:normal; word-break:break-all;">'+message.title+'</span><p style="min-width:170px;">'+sb+'</p></div><p style="padding-left:40px;"><span class="fl">'+message.createTime+'</span><span class="fr">回复</span></p></li>';
							    			}
							    			if(friendPageNum == 1){  
							    				$(obj).html("");  // 新增互动信息则清空之前数据，重新加载
							    			}
							    			$(interactionInfo).appendTo(obj); // 追加数据
							    			friendPageNum = data.data.pageNum + 1; // 记录当前页数
							    			//执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
									        //totalPage为Ajax返回的总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
										}
						    			next('', data.data.pageNum < data.data.totalPage); //假设总页数为 10
						    		}
					    	  });
					      }, 500);
					}
			});
		}, 1000);
		
		// 加载自己发布的互动信息
		setTimeout(function(){
			 var obj=$("body #myInfo");
			flow.load({
				elem: '#myInfo' //流加载容器
					,scrollElem:  '#myInfo' 
					,isAuto : 'true'
					,done: function(page, next){ //执行下一页的回调
					      setTimeout(function(){
					    	 var param = {};
					 		 param.pageNum = myPageNum;
					 		 param.infoType = 2;
					    	  $.ajax({
					    		  url:"/chat/selectMessage",
						    		type:"get",
						    		data:param,
						    		async: false,//改为同步
						    		success:function(data) {
						    			if(data!=null){
						    				if(data.data.pageData != null){
						    					var interactionInfo = "";
						    					for (var i = 0; i < data.data.pageData.length; i++) {
						    						var message = data.data.pageData[i];
						    						interactionInfo += '<li layim-event="" data-id="'+message.id+'" data-index="0" class="layim-group101">';
						    						interactionInfo += '<img src="'+message.avatar+'"><span>'+message.title+'</span><p>'
						    						if(message.unitName.trim().length!=0){
						    							interactionInfo	+= message.unitName+' — '
						    						}
						    						interactionInfo += message.userName+'</p><p><span class="fl">'+message.createTime+'</span><span class="fr">回复</span></p></li>';
						    					}
						    					if(myPageNum == 1){  
						    						$(obj).html("");  // 新增互动信息则清空之前数据，重新加载
						    					}
						    					$(interactionInfo).appendTo(obj); // 追加数据
						    					myPageNum = data.data.pageNum + 1; // 记录当前页数
						    					//执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
						    					//totalPage为Ajax返回的总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
						    				}
						    				next('', data.data.pageNum < data.data.totalPage); //假设总页数为 10
						    			}
						    		}
					    	  });
					      }, 500);
					}
			});
		}, 1000);
		
		// 如果是监管对象则显示通知公告按钮
		if(cache.mine.status != 2){
			$("body #hdtab_2").remove();
			var notice = " <span id='hdtab_2'>通知公告</span>";
			$(notice).appendTo("body .hdtab_tit");
		}
		
		// 如果是监管对象则显示通知公告按钮
		$("body #txtshow").remove();
		if(cache.mine.status == 0){
			var notice = "<span id='txtshow'>通知公告对象：所有用户</span> ";
			$(notice).appendTo("body .tinp");
		}else{
			var notice = "<span id='txtshow'>通知公告对象：下级所有用户</span> ";
			$(notice).appendTo("body .tinp");
		}
	})
	
	  
	 $('body').on("click",".addhd a",function(){
		 	$("#hdAllInfo ul").hide();
			$("#hdMyInfo ul").hide();
			$(".hadd").find("li").remove();
			$(".hadd").show();
		});
	 $('body').on("click","#my a",function(){
		   stats=0;
			$("#hdAllInfo ul").hide();
			$("#hdMyInfo ul").show();
	    });
	 $('body').on("click",".gobackAll",function(){
		    stats=1;
			$("#hdAllInfo ul").show();
			$("#hdMyInfo ul").hide();
	    });
	 $('body').on("click",".hlis li",function(){
			$(".hdAll").hide();
			$(".htxt").show();
	    });
	 $('body').on("click",".tabHd",function(){
		  	stats=1;
			$(".hdAll").hide();
			$("#hdAllInfo ul").show();
			$(".addhd").show();
			
			
	    });
	 $('body').on("click",".prevL",function(){
		 	$(".hdAll").hide();
		 	if(stats==1){
		 		$("#hdAllInfo ul").show();//返回到列表，需要判断当前回复是总列表，还是与我相关的列表
		 	}else{
		 		$("#hdMyInfo ul").show();
		 	}
			$(".addhd").show();
	    });
	 $('body').on("click",".hdtab_tit span",function(){
			var tab=$(this).attr("id");
			$(".hdtab_tit span").removeClass("hover");
			$(this).addClass("hover");
			$(".hdtab").hide();
			$("#con_"+tab).show();

	    });
	 $('body').on("click",".replyA",function(){
			if($(this).text()=="回复"){
				$(this).text("取消").css("color","#999");
				$(this).next(".retxt").show();
			}else{
				$(this).text("回复").css("color","#F30");
				$(this).next(".retxt").hide();
				}
			
	    });
	/* $("body .move").mousemove(function(e) { 
       // $("a replyA").show();
		 alert("s");
     }) 
	 */
	 // 发送公告
	 $('body').on('click','#submitNotice', function(){
		    var param={}; 
		     param.content=$("#noticeContent").val();
		     if(param.content.trim().length == 0){
		    	 layer.msg('内容不能为空', {time: 3000, icon:5});  //icon 改变图标
		    	 return false;
		     }
		     if(param.content.trim().length > 201){
		    	 layer.msg('不能超过200个字', {time: 3000, icon:5});  //icon 改变图标
		    	 return false;
		     }
		     param.msgType=2;//消息类型(1互动，2公告)
		     $("#submitNotice").attr("disabled", "disabled");// 设置button不可用
		     $.ajax({
		    	 url:"/chat/addMessage",
		    	 type:"post",
		    	 data:param,
		    	 success:function(obj) {
		    		 if(obj.code == 200){
		    			 layer.msg("发送成功", { shift: -1  ,icon:1}, function () {
		    				 $("#noticeContent").val("");
		    				 $("#submitNotice").attr("disabled", false);
		    				 $('#message').trigger("click");
		    			 });
		    		 }else{
		    			$("#submitNotice").attr("disabled", false);
		    			layer.msg(obj.msg, {time: 3000, icon:5});  //icon 改变图标
		    		 }
		    	 }
		     });
	  })
	  
	  // 添加互动
	 $('body').on('click','#submitInteraction', function(){
		    var param={}; 
		    param.title=$("#interactionTitle").val(); // 互动信息标题
		    param.content=$("#interactionContent").val(); // 互动信息内容
		    if(param.title.trim().length <= 0){
		    	layer.open({
		    		  title: '提示'
		    		  ,content: '标题不能为空'
		    		}); 
		    	return;
		    }
		    if(param.content.trim().length <= 0){
		    	layer.open({
		    		  title: '提示'
		    		  ,content: '内容不能为空'
		    		}); 
		    	return;
		    }
		    if(param.title.length > 20){
		    	layer.open({
		    		  title: '提示'
		    		  ,content: '标题长度不能超过20个字'
		    		}); 
		    	return;
		    }
		    
		    if(param.content.length > 500){
		    	layer.open({
		    		  title: '提示'
		    		  ,content: '内容长度不能超过500个字'
		    		}); 
		    	return;
		    }
		    param.msgType=1;// 消息类型(1互动，2公告)
		     //存储互动信息
		     $.ajax({
		    		url:"/chat/addMessage",
		    		type:"POST",
		    		data:param,
		    		success:function(data) {
		    			$('#interaction').trigger("click");
		    		}
		     });
	 })
	 var pageid = null;
	 
	  //回复
	 $('body').on('click','.btnE', function(){
	  var param={}; 
		  param.ids=$(this).prev().attr("data-id");//回复消息ID
		  param.type=$(this).prev().attr("data-type");//回复消息ID
		  param.content=$(this).prev(".form-control").val();//回复内容
		  
		  if(param.content == ""&& param.content.length==0){
		    	layer.msg('回复不可为空', {time: 3000, icon:5});  //icon 改变图标
		    }else{
		  $(this).parent().prev(".replyA").text("回复").css("color","#F30");
		  $(this).parent(".retxt").hide();
		  $(this).prev(".form-control").val("");
		  var icon = 0;
		  $.ajax({
	    	   url:"/chat/addMessageComment",
	    	   type:"POST",
	           data: param,
	           async: false,//改为同步
	           success: function (data) {
	        	   if(data.code==200){
	        		   icon = 1;
	        	   }else{
	        		   icon = 5;
	        	   }
	        	  layer.msg(data.msg, {time: 3000, icon:icon});
	           }
	       });
	  			 if(icon == 1){
					  var obj=$("body #findHuihu");
					  if(pageid !=null){
						  hf(obj,pageid);
					  }
				  }
		    }
		 
	  })
	  
	 //查看回复信息
	 $('body').on("click",".layim-group101",function(){
     	var id = $(this).attr("data-id");
     	 pageid=id;
     	 var obj=$("body #findHuihu");
     	 hf(obj,id);
	 });
	 
	 function hf(obj,id){
	    	$.ajax({
	    		url:"/chat/getMessage/"+id,
	    		type:"GET",
	    		data:{id:id}, 
	    		async: false,//改为同步
	    		success:function(objs) { 
	    			obj.find("ul").remove();//清除追加数据
	    			var message = objs.data;
	        		var html1="";
	        		var spanName="";
	        		if(message.unitName!= null){
	        			 spanName=message.unitName+"-"+message.userName;
	        		}else{
	        			 spanName=message.userName;
	        		}
	        		
	        		var spanName1=null;
	        		if(spanName.length >20){
	        			spanName1=spanName.substring(0,16)+"...";
	        		}else{
	        			spanName1=spanName;
	        		}	        		
	        		 html1+="<ul id='sb' class='layui-show layim-list-interactive' style='max-height:345px; margin-bottom:0;'>" +
 					"<li layim-event='' data-id='' data-index='0' class='layim-group102'>" +
 					"<div style='float:left'><img src='"+message.avatar+"'></div>" +
 					"<div style='float:left'><span>"+spanName1+"</span><br/>" +
 					"<p>"+message.createTime+"</p></div>" +
 					"<p><div  style=' width: 225px; height: auto;word-wrap: break-word;'>" +message.content+"</div></p>" +
 					"<p class='replyA'><a href='javascript:;'>&nbsp;回复</a></p>" +
 					"<p class='retxt'><textarea class='form-control' data-id="+message.id+"-"+message.msgType+" data-type='1'    rows='2' maxlength='50' placeholder='输入回复内容'></textarea><button type='button' class='btnE'>提交</button></p>" +
 					"</li>";
	        		 
	        		 html1+="<li class='prevL'><a href='javascript:;'><i class='layui-icon'>&#xe603;</i></a></li>"
	        		$(html1).appendTo(obj); // 追加数据
	    		}
	    	});
		 
			// 加载流言信息
			/*setTimeout(function(){*/
			var myPageNum1=1;
				 var obj1=$(".layim-group102");
				flow.load({
					elem: '#sb' //流加载容器
						//,findHuihu:  '#sb' 
						,isAuto : 'false'
						,done: function(page, next){ //执行下一页的回调
						      /*setTimeout(function(){*/
						    	 var param = {};
						 		 param.pageNum = myPageNum1;
						 		 param.id = id;
						     	$.ajax({
						    		  url:"/chat/getMessageComment",
							    		type:"get",
							    		data:param,
							    		async: false,//改为同步
							    		success:function(obj) {
							    			if(obj.data!=null){
							    				var html2="";
							    				var length = obj.data.pageData.length;
							    				if(length>0){
							    					var messageComment = obj.data.pageData;
							    					for (var i = 0; i < messageComment.length; i++) {
							    						html2+=" <li layim-event='' data-type='' data-index='0' class=''>"+		
							    						"<span>"+messageComment[i].userNameUnitName+"</span><p>"+messageComment[i].createTime+"</p>"+
							    						"<p  class='rptxt' > <div  style=' width: 225px; height: auto;word-wrap: break-word;'>"+messageComment[i].content+"</div></p>";
							    						if(messageComment[i].messageCommentList != null){
							    							for (var b = 0; b < messageComment[i].messageCommentList.length; b++) {
							    								html2+="<div style=' width: 225px; height: auto;word-wrap: break-word;font-size:10px;word-break: break-all; ' class='move'><span style='color:#D70000;'>"+messageComment[i].messageCommentList[b].createName+"</span><span style='color:#969696;'>&nbsp;回复&nbsp;</span><span style='color:#D70000;vertical-align: baseline;'>"+messageComment[i].messageCommentList[b].replyName+"</span>："+messageComment[i].messageCommentList[b].content+"<a href='javascript:;' class='replyA' style='color:#0000FE;font-size:10px;'>回复</a><p class='retxt'><textarea class='form-control' data-id="+messageComment[i].messageCommentList[b].id+'-'+messageComment[i].id+'-'+id+"  data-type='3'rows='2'  maxlength='50'  placeholder='输入回复内容'></textarea><button type='button' class='btnE'>提交</button></p></div>" ;
							    							}
							    						}
							    						html2+="<p class='replyA'><a href='javascript:;' >回复</a></p>" +
							    						"<p class='retxt'><textarea class='form-control' data-id="+messageComment[i].id+'-'+id+" data-type='2' rows='2'  maxlength='50'  placeholder='输入回复内容'></textarea><button type='button' class='btnE'>提交</button></p>" +
							    						"</li>"; 
							    					}
							    					obj1.append(html2);
							    					myPageNum1 = obj.data.pageNum + 1; // 记录当前页数
							    				}
							    				next('', obj.data.pageNum < obj.data.totalPage); //假设总页数为 10
							    			}else{
							    				next('', 1 < 0); //假设总页数为 10
							    			}
							    		}
						    	  });
						   /*   }, 500);*/

						}
				});
			/*}, 100);*/
	 }
});

  //换肤模版
  var elemSkinTpl = ['<ul class="layui-layim-skin">'
  ,'{{# layui.each(d.skin, function(index, item){ }}'
    ,'<li><img layim-event="setSkin" src="{{ item }}"></li>'
  ,'{{# }); }}'
  ,'<li layim-event="setSkin"><cite>简约</cite></li>'
  ,'</ul>'].join('');
  
  //聊天主模板
  var elemChatTpl = ['<div class="left_main layim-chat layim-chat-{{d.data.type}}{{d.first ? " layui-show" : ""}}">'
	,'<div class="layui-unselect layim-chat-title">'
      ,'<div class="layim-chat-other">'
        ,'<img class="layim-{{ d.data.type }}{{ d.data.id }}" src="{{ d.data.avatar }}"><span class="layim-chat-username" layim-event="{{ d.data.type==="group" ? \"groupMembers\" : \"\" }}">{{ d.data.name||"佚名" }} {{d.data.temporary ? "<cite>临时会话</cite>" : ""}} {{# if(d.data.type==="group"){ }} <em class="layim-chat-members"></em><i class="layui-icon">&#xe61a;</i> {{# } }}</span>'
        ,'<p class="layim-chat-status"></p>'
      ,'</div>'
    ,'</div>'
    ,'<div class="layim-chat-main">'
      ,'<ul></ul>'
    ,'</div>'
    ,'<div class="layim-chat-footer">'
      ,'<div class="layui-unselect layim-chat-tool" data-json="{{encodeURIComponent(JSON.stringify(d.data))}}">'
        ,'<span class="layui-icon layim-tool-face" title="选择表情" layim-event="face">&#xe60c;</span>'
        ,'{{# if(d.base && d.base.uploadImage){ }}'
        ,'<span class="layui-icon layim-tool-image" title="上传图片" layim-event="image" style="display:none;">&#xe60d;<input type="file" name="file"></span>'
        ,'{{# }; }}'
        ,'{{# if(d.base && d.base.uploadFile){ }}'
        ,'<span class="layui-icon layim-tool-image" title="发送文件" layim-event="image" data-type="file">&#xe61d;<input type="file" name="file"></span>'
         ,'{{# }; }}'
         ,'{{# if(d.base && d.base.isAudio){ }}'
        ,'<span class="layui-icon layim-tool-audio" title="发送网络音频" layim-event="media" data-type="audio">&#xe6fc;</span>'
         ,'{{# }; }}'
         ,'{{# if(d.base && d.base.isVideo){ }}'
        ,'<span class="layui-icon layim-tool-video" title="发送网络视频" layim-event="media" data-type="video">&#xe6ed;</span>'
         ,'{{# }; }}'
         ,'{{# layui.each(d.base.tool, function(index, item){ }}'
        ,'<span class="layui-icon layim-tool-{{item.alias}}" title="{{item.title}}" layim-event="extend" lay-filter="{{ item.alias }}">{{item.icon}}</span>'
         ,'{{# }); }}'
        ,'{{# if(d.base && d.base.chatLog){ }}'
        ,'<span class="layim-tool-log" layim-event="chatLog"><i class="layui-icon">&#xe60e;</i>聊天记录</span>'
        ,'{{# }; }}'
      ,'</div>'
      ,'<div class="layim-chat-textarea"><textarea></textarea></div>'
      ,'<div class="layim-chat-bottom">'
        ,'<div class="layim-chat-send">'
          ,'{{# if(!d.base.brief){ }}'
          ,'<span class="layim-send-close" layim-event="closeThisChat">关闭</span>'
          ,'{{# } }}'
          ,'<span class="layim-send-btn" layim-event="send">发送</span>'
          ,'<span class="layim-send-set" layim-event="setSend" lay-type="show"><em class="layui-edge"></em></span>'
          ,'<ul class="layui-anim layim-menu-box">'
            ,'<li {{d.local.sendHotKey !== "Ctrl+Enter" ? "class=layim-this" : ""}} layim-event="setSend" lay-type="Enter"><i class="layui-icon">&#xe618;</i>按Enter键发送消息</li>'
            ,'<li {{d.local.sendHotKey === "Ctrl+Enter" ? "class=layim-this" : ""}} layim-event="setSend"  lay-type="Ctrl+Enter"><i class="layui-icon">&#xe618;</i>按Ctrl+Enter键发送消息</li>'
          ,'</ul>'
        ,'</div>'
      ,'</div>'
    ,'</div>'
  ,'</div>'
  
  ,'<div class="right_sidebar {{d.first ? " layui-show" : ""}}">'
	,'<h2 class="Mtit"><i class="layui-icon" style="font-size: 14px; color: #666666;">&#xe623;</i>对方单位及个人信息</h2>'
	,'<div class="scon"></div>'
		
  ,'</div>'].join('');
   
  //公告消息聊天主模板
//  var elemNoticeTpl = ['<div class="left_main layim-chat layim-chat-{{d.data.type}}{{d.first ? " layui-show" : ""}}">'
//                       ,'<div class="layui-unselect layim-chat-title">'
//                           ,'<div class="layim-chat-other">'
//                               ,'<img class="layim-{{ d.data.type }}{{ d.data.id }}" src="{{ d.data.avatar }}"><span class="layim-chat-username" layim-event="{{ d.data.type==="group" ? \"groupMembers\" : \"\" }}">{{ d.data.name||"佚名" }} {{d.data.temporary ? "" : ""}} {{# if(d.data.type==="group"){ }} <em class="layim-chat-members"></em><i class="layui-icon">&#xe61a;</i> {{# } }}</span>'
//                               ,'<p class="layim-chat-status"></p>'
//                               ,'</div>'
//                           ,'</div>'
//                       ,'<div class="layim-chat-main">'
//                           ,'<ul></ul>'
//                           ,'</div>'
//                       ,'</div>'].join('');
  //zdst自定义公告消息模板
  var elemNoticeTpl = ['<div class="left_main layim-chat layim-chat-{{d.data.type}}{{d.first ? " layui-show" : ""}}" style="height:440px;width:100%;">'
                 	,'<div class="layui-unselect layim-chat-title">'
                       ,'<div class="layim-chat-other">'
                         ,'<img class="layim-{{ d.data.type }}{{ d.data.id }}" src="{{ d.data.avatar }}"><span class="layim-chat-username" layim-event="{{ d.data.type==="group" ? \"groupMembers\" : \"\" }}">{{ d.data.name||"佚名" }} {{d.data.temporary ? "<cite></cite>" : ""}} {{# if(d.data.type==="group"){ }} <em class="layim-chat-members"></em><i class="layui-icon">&#xe61a;</i> {{# } }}</span>'
                         ,'<p class="layim-chat-status"></p>'
                       ,'</div>'
                     ,'</div>'
                     ,'<div class="layim-chat-main noticeChat" style="height:410px!important;">'
                       ,'<ul></ul>'
                     ,'</div>'
                     ,'<div class="layim-chat-footer" style="display:none;">'
                       ,'<div class="layui-unselect layim-chat-tool" data-json="{{encodeURIComponent(JSON.stringify(d.data))}}">'
                         ,'<span class="layui-icon layim-tool-face" title="选择表情" layim-event="face">&#xe60c;</span>'
                         ,'{{# if(d.base && d.base.uploadImage){ }}'
                         ,'<span class="layui-icon layim-tool-image" title="上传图片" layim-event="image">&#xe60d;<input type="file" name="file"></span>'
                         ,'{{# }; }}'
                         ,'{{# if(d.base && d.base.uploadFile){ }}'
                         ,'<span class="layui-icon layim-tool-image" title="发送文件" layim-event="image" data-type="file">&#xe61d;<input type="file" name="file"></span>'
                          ,'{{# }; }}'
                          ,'{{# if(d.base && d.base.isAudio){ }}'
                         ,'<span class="layui-icon layim-tool-audio" title="发送网络音频" layim-event="media" data-type="audio">&#xe6fc;</span>'
                          ,'{{# }; }}'
                          ,'{{# if(d.base && d.base.isVideo){ }}'
                         ,'<span class="layui-icon layim-tool-video" title="发送网络视频" layim-event="media" data-type="video">&#xe6ed;</span>'
                          ,'{{# }; }}'
                          ,'{{# layui.each(d.base.tool, function(index, item){ }}'
                         ,'<span class="layui-icon layim-tool-{{item.alias}}" title="{{item.title}}" layim-event="extend" lay-filter="{{ item.alias }}">{{item.icon}}</span>'
                          ,'{{# }); }}'
                         ,'{{# if(d.base && d.base.chatLog){ }}'
                         ,'<span class="layim-tool-log" layim-event="chatLog"><i class="layui-icon">&#xe60e;</i>聊天记录</span>'
                         ,'{{# }; }}'
                       ,'</div>'
                       ,'<div class="layim-chat-textarea"><textarea></textarea></div>'
                       ,'<div class="layim-chat-bottom">'
                         ,'<div class="layim-chat-send">'
                           ,'{{# if(!d.base.brief){ }}'
                           ,'<span class="layim-send-close" layim-event="closeThisChat">关闭</span>'
                           ,'{{# } }}'
                           ,'<span class="layim-send-btn" layim-event="send">发送</span>'
                           ,'<span class="layim-send-set" layim-event="setSend" lay-type="show"><em class="layui-edge"></em></span>'
                           ,'<ul class="layui-anim layim-menu-box">'
                             ,'<li {{d.local.sendHotKey !== "Ctrl+Enter" ? "class=layim-this" : ""}} layim-event="setSend" lay-type="Enter"><i class="layui-icon">&#xe618;</i>按Enter键发送消息</li>'
                             ,'<li {{d.local.sendHotKey === "Ctrl+Enter" ? "class=layim-this" : ""}} layim-event="setSend"  lay-type="Ctrl+Enter"><i class="layui-icon">&#xe618;</i>按Ctrl+Enter键发送消息</li>'
                           ,'</ul>'
                         ,'</div>'
                       ,'</div>'
                     ,'</div>'
                   ,'</div>'
                   
                   ,'<div class="right_sidebar {{d.first ? "" : ""}}" style="display:none !important;">'
                 	,'<h2 class="Mtit"><i class="layui-icon" style="font-size: 14px; color: #666666;">&#xe623;</i>对方单位及个人信息</h2>'
                   	/*,'<div class="scon">'
                 		,'<h3 class="cpy_tit">狠流弊维保公司</h3>'
                 		,'<b class="wx_t">对新太阳神酒店的维修情况：</b>'    
                 		,'<span class="mli"><a href="javascript:;">物联设备故障（3）</a></span>'
                 		,'<span class="mli"><a href="javascript:;">人工报修（3）</a></span>'
                 		,'<span class="btnB"><a href="javascript:;" class="lsBtn">查看维修历史</a></span>'
                 		,'<b class="wx_t">对新太阳神酒店的下次维保时间：</b>'
                 		,'<span class="mli">2017/8/30</span>'
                 		,'<span class="btnB"><a href="javascript:;" class="lsBtn">查看维保历史</a></span>'
                 	,'</div>'*/
                 	,'<div class="scon">'
                 		,'<h3 class="cpy_tit">新太阳神酒店</h3>'
                 		,'<b class="wx_t"><span>综合风险等级：</span><em class="cor Cyel"></em></b>'    
                 		,'<b class="wx_t">未整改隐患：<em class="yhnum">19/20</em></b>' 
                 		,'<b class="wx_t t10">物联设备异常状态：</b>'
                 		,'<div class="ulcon"><ul>'
                 		,'<li><a href="javascript:;">火警（3）</a></li>'
                 		,'<li><a href="javascript:;">报警（3）</a></li>'
                 		,'<li><a href="javascript:;">故障（3）</a></li>'
                 		,'<li><a href="javascript:;">误报（3）</a></li>'
                 		,'<li><a href="javascript:;">失连（3）</a></li>'
                 		,'<li><a href="javascript:;">正常（3）</a></li>'
                 		,'</ul></div>'
                 		,'<span class="btnB"><a href="javascript:;" class="lsBtn" layim-event="checkhos">查看检查历史</a></span>'
                 	,'</div>'
                 	,'<div class="bner">'
                 		,'<img src="http://localhost/layim01/src/images/banner01.jpg" width="169">'
                 	,'</div>'
                 	,'<div class="uInfo">'
                 		,'<h3 class="cpy_tit">狠流弊维保公司</h3>'
                 		,'<ul>'
                 		,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe612;</i> 维保工程师</li>'
                 		,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe63b;</i> 1850000000</li>'
                 		,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe611;</i> zhangxiao@zds-t.com</li>'
                 		,'</ul>'
                 	,'</div>'
                   ,'</div>'].join('');

  //添加好友群组模版
  var elemAddTpl = ['<div class="layim-add-box">'
    ,'<div class="layim-add-img"><img class="layui-circle" src="{{ d.data.avatar }}"><p>{{ d.data.name||"" }}</p></div>'
    ,'<div class="layim-add-remark">'
    ,'{{# if(d.data.type === "friend" && d.type === "setGroup"){ }}'
      ,'<p>选择分组</p>'
    ,'{{# } if(d.data.type === "friend"){ }}'
    ,'<select class="layui-select" id="LAY_layimGroup">'
      ,'{{# layui.each(d.data.group, function(index, item){ }}'
      ,'<option value="{{ item.id }}">{{ item.groupname }}</option>'
      ,'{{# }); }}'
    ,'</select>'
    ,'{{# } }}'
    ,'{{# if(d.data.type === "group"){ }}'
      ,'<p>请输入验证信息</p>'
    ,'{{# } if(d.type !== "setGroup"){ }}'
      ,'<textarea id="LAY_layimRemark" placeholder="验证信息" class="layui-textarea"></textarea>'
    ,'{{# } }}'
    ,'</div>'
  ,'</div>'].join('');
  
  //聊天内容列表模版
  var elemChatMain = ['<li {{ d.mine ? "class=layim-chat-mine" : "" }} {{# if(d.cid){ }}data-cid="{{d.cid}}"{{# } }}>'
    ,'<div class="layim-chat-user"><img src="{{ d.avatar }}"><cite>'
    ,'{{# if(d.mine){ }}'
      ,'<i>{{ layui.data.date(d.timestamp) }}</i>{{ d.username||"佚名" }}'
     ,'{{# } else { }}'
      ,'{{ d.username||"佚名" }}<i>{{ layui.data.date(d.timestamp) }}</i>'
     ,'{{# } }}'
      ,'</cite></div>'
    ,'<div class="layim-chat-text">{{ layui.data.content(d.content||"&nbsp") }}</div>'
  ,'</li>'].join('');
  
  //zdst设备异常通知聊天模板
//  var elemDeviceMain = ['<li {{ d.mine ? "class=layim-chat-mine" : "" }} {{# if(d.cid){ }}data-cid="{{d.cid}}"{{# } }}>'
//                      ,'<div class="layim-chat-user"><img src="{{ d.avatar }}"><cite>'
//                      ,'{{# if(d.mine){ }}'
//                        ,'<i>{{ layui.data.date(d.timestamp) }}</i>{{ d.username||"佚名" }}'
//                       ,'{{# } else { }}'
//                        ,'{{ d.username||"佚名" }}<i>{{ layui.data.date(d.timestamp) }}</i>'
//                       ,'{{# } }}'
//                        ,'</cite></div>'
//                      /*,'<div class="layim-chat-text">{{ layui.data.content(d.content||"&nbsp") }}</div>'*/
//                        ,'<div class="layim-chat-text"><ul style="list-style:none;font-size:18px;font-weight:bold;"><li>异常设备通知</li><li>设备类型：111</li><li>设备地址：222</li><li>设备状态：333</li><li>位置：楼栋+楼层</li><li>最后上报时间：2017-8-15 17:12:32</li></ul></div>'
//                    ,'</li>'].join('');
  
  var elemChatList = '<li class="layim-{{ d.data.type }}{{ d.data.id }} layim-chatlist-{{ d.data.type }}{{ d.data.id }} layim-this" layim-event="tabChat"><img src="{{ d.data.avatar }}"><span>{{ d.data.name||"佚名" }}</span>{{# if(!d.base.brief){ }}<i class="layui-icon" layim-event="closeChat">&#x1007;</i>{{# } }}</li>';
  
  //补齐数位
  var digit = function(num){
    return num < 10 ? '0' + (num|0) : num;
  };
  
  //转换时间
  layui.data.date = function(timestamp){
    var d = new Date(timestamp||new Date());
    return d.getFullYear() + '-' + digit(d.getMonth() + 1) + '-' + digit(d.getDate())
    + ' ' + digit(d.getHours()) + ':' + digit(d.getMinutes()) + ':' + digit(d.getSeconds());
  };
  
  //转换内容
  layui.data.content = function(content){
    //支持的html标签
    var html = function(end){
      return new RegExp('\\n*\\['+ (end||'') +'(pre|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
    };
    content = (content||'').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
    /*zdst注释，避免设备异常通知呗转义*/
    /*.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;') //XSS
    .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2') //转义@
     */    
    .replace(/face\[([^\s\[\]]+?)\]/g, function(face){  //转义表情
      var alt = face.replace(/^face/g, '');
      return '<img alt="'+ alt +'" title="'+ alt +'" src="' + faces[alt] + '">';
    })
    .replace(/img\[([^\s]+?)\]/g, function(img){  //转义图片
      return '<img class="layui-layim-photos" src="' + img.replace(/(^img\[)|(\]$)/g, '') + '">';
    })
    .replace(/file\([\s\S]+?\)\[[\s\S]*?\]/g, function(str){ //转义文件
      var href = (str.match(/file\(([\s\S]+?)\)\[/)||[])[1];
      var text = (str.match(/\)\[([\s\S]*?)\]/)||[])[1];
      if(!href) return str;
      return '<a class="layui-layim-file" href="'+ href +'" download target="_blank"><i class="layui-icon">&#xe61e;</i><cite>'+ (text||href) +'</cite></a>';
    })
    .replace(/audio\[([^\s]+?)\]/g, function(audio){  //转义音频
      return '<div class="layui-unselect layui-layim-audio" layim-event="playAudio" data-src="' + audio.replace(/(^audio\[)|(\]$)/g, '') + '"><i class="layui-icon">&#xe652;</i><p>音频消息</p></div>';
    })
    .replace(/video\[([^\s]+?)\]/g, function(video){  //转义音频
      return '<div class="layui-unselect layui-layim-video" layim-event="playVideo" data-src="' + video.replace(/(^video\[)|(\]$)/g, '') + '"><i class="layui-icon">&#xe652;</i></div>';
    })
    
    .replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function(str){ //转义链接
      var href = (str.match(/a\(([\s\S]+?)\)\[/)||[])[1];
      var text = (str.match(/\)\[([\s\S]*?)\]/)||[])[1];
      if(!href) return str;
      return '<a href="'+ href +'" target="_blank">'+ (text||href) +'</a>';
    }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
    .replace(/\n/g, '<br>') //转义换行 
    return content;
  };

  //Ajax
  var post = function(options, callback, tips){
    options = options || {};
    return $.ajax({
      url: options.url
      ,type: options.type || 'get'
      ,data: options.data
      ,dataType: options.dataType || 'json'
      ,cache: false
      ,success: function(res){
        res.code == 0 
          ? callback && callback(res.data||{})
        : layer.msg(res.msg || ((tips||'Error') + ': LAYIM_NOT_GET_DATA'), {
          time: 5000
        });
      },error: function(err, msg){
        window.console && console.log && console.error('LAYIM_DATE_ERROR：' + msg);
      }
    });
  };
  
  //处理初始化信息
  var cache = {message: {}, chat: []}, init = function(options){
    var init = options.init || {}
     mine = init.mine || {}
    ,local = layui.data('layim')[mine.id] || {}
    ,obj = {
      base: options
      ,local: local
      ,mine: mine
      ,history: local.history || {}
    }, create = function(data){
      var mine = data.mine || {};
      var local = layui.data('layim')[mine.id] || {}, obj = {
        base: options //基础配置信息
        ,local: local //本地数据
        ,mine:  mine //我的用户信息
        ,friend: data.friend || [] //联系人信息
        ,group: data.group || [] //群组信息
        ,history: local.history || {} //历史会话信息
      };
      cache = $.extend(cache, obj);
      popim(laytpl(elemTpl).render(obj));
      if(local.close || options.min){
        popmin();
      }
      layui.each(call.ready, function(index, item){
        item && item(obj);
      });
    };
    cache = $.extend(cache, obj);
    if(options.brief){
      return layui.each(call.ready, function(index, item){
        item && item(obj);
      });
    };
    init.url ? post(init, create, 'INIT') : create(init);
  };
  
  //显示主面板
  var layimMain, popim = function(content){
    return layer.open({
      type: 1
      ,area: ['260px', '520px']
      ,skin: 'layui-box layui-layim'
      ,title: '&#8203;'
      ,offset: 'rb'
      ,id: 'layui-layim'
      ,shade: false
      ,anim: 2
      ,resize: false
      ,content: content
      ,success: function(layero){
        layimMain = layero;

        setSkin(layero);
        
        if(cache.base.right){
          layero.css('margin-left', '-' + cache.base.right);
        }
        if(layimClose){
          layer.close(layimClose.attr('times'));
        }

        //按最新会话重新排列
        var arr = [], historyElem = layero.find('.layim-list-history');
        historyElem.find('li').each(function(){
          arr.push($(this).prop('outerHTML'))
        });
        if(arr.length > 0){
          arr.reverse();
          historyElem.html(arr.join(''));
        }
        
        banRightMenu();
        events.sign();
      }
      ,cancel: function(index){
        popmin();
        var local = layui.data('layim')[cache.mine.id] || {};
        local.close = true;
        layui.data('layim', {
          key: cache.mine.id
          ,value: local
        });
        return false;
      }
    });
  };
  
  //屏蔽主面板右键菜单
  var banRightMenu = function(){
    layimMain.on('contextmenu', function(event){
      event.cancelBubble = true 
      event.returnValue = false;
      return false; 
    });
    
    var hide = function(){
      layer.closeAll('tips');
    };
    
    //自定义历史会话右键菜单
    layimMain.find('.layim-list-history').on('contextmenu', 'li', function(e){
      var othis = $(this);
      var html = '<ul data-id="'+ othis[0].id +'" data-index="'+ othis.data('index') +'"><li layim-event="menuHistory" data-type="one">移除该会话</li><li layim-event="menuHistory" data-type="all">清空全部会话列表</li></ul>';
      
      if(othis.hasClass('layim-null')) return;
      
      layer.tips(html, this, {
        tips: 1
        ,time: 0
        ,anim: 5
        ,fixed: true
        ,skin: 'layui-box layui-layim-contextmenu'
        ,success: function(layero){
          var stopmp = function(e){ stope(e); };
          layero.off('mousedown', stopmp).on('mousedown', stopmp);
        }
      });
      $(document).off('mousedown', hide).on('mousedown', hide);
      $(window).off('resize', hide).on('resize', hide);
      
    });
  }
  
  //主面板最小化状态
  var layimClose, popmin = function(content){
    if(layimClose){
      layer.close(layimClose.attr('times'));
    }
    if(layimMain){
      layimMain.hide();
    }
    cache.mine = cache.mine || {};
    return layer.open({
      type: 1
      ,title: false
      ,id: 'layui-layim-close'
      ,skin: 'layui-box layui-layim-min layui-layim-close'
      ,shade: false
      ,closeBtn: false
      ,anim: 2
      ,offset: 'rb'
      ,resize: false
      ,content: '<img src="'+ (cache.mine.avatar||(layui.cache.dir+'css/pc/layim/skin/logo.jpg')) +'"><span>'+ (content||cache.base.title||cache.mine.username) +'</span>'
      ,move: '#layui-layim-close img'
      ,success: function(layero, index){
        layimClose = layero;
        if(cache.base.right){
          layero.css('margin-left', '-' + cache.base.right);
        }
        layero.on('click', function(){
          layer.close(index);
          layimMain.show();
          var local = layui.data('layim')[cache.mine.id] || {};
          delete local.close;
          layui.data('layim', {
            key: cache.mine.id
            ,value: local
          });
        });
      }
    });
  };
  
  //显示聊天面板
  var layimChat, layimMin, chatIndex, To = {}, popchat = function(data){
    data = data || {};
//  zdst修改：判断消息类型，显示不用聊天模板
    var elemTpl1;
    
    var fromidArr = new Array("notice","superiorInform","devAlarm","hidden","hiddenOverdue","breakdown","overrun","rescue")
    //判断是否存在
    var result = $.inArray(data.fromid, fromidArr);
    //-1表示不包含有这些参数
    if(result == -1){
    	 elemTpl1=elemChatTpl;
    }else{
    	 elemTpl1=elemNoticeTpl;
    }



    
    var chat = $('#layui-layim-chat'), render = {
      data: data
      ,base: cache.base
      ,local: cache.local
    };
    
    
    if(!data.id){
      return layer.msg('非法用户');
    }
    var status = data.status; // 1 监管单位 2 被监管对象

    if(result == -1){
    	if(status != undefined){
    		$.ajax({
    			url:"/chat/chatBoxInfo/" + data.id,
    			type:"get",
    			success:function(data) {
    				var info = data.data;
    				$('body .scon').html("");
    				/*if(status == 2){  // 2 被监管对象
						var html = ['<div class="boxInfo">'
						            ,'<h3 class="cpy_tit">'+info.relatedName+'</h3>'
									,'<b class="wx_t"><span>综合风险等级：</span><em class="cor Cyel"></em></b>'    
									,'<b class="wx_t">未整改隐患：<em class="yhnum">'+info.unmodified+'/'+info.dangerCount+'</em></b>' 
									,'<b class="wx_t t10">物联设备异常状态：</b>'
									,'<div class="ulcon"><ul>'
									,'<li><a href="javascript:;">火警（'+info.fireUnConfirmNum+'）</a></li>'
									,'<li><a href="javascript:;">报警（'+info.alarmNum+'）</a></li>'
									,'<li><a href="javascript:;">故障（'+info.faultNum+'）</a></li>'
									,'<li><a href="javascript:;">误报（'+info.falseNum+'）</a></li>'
									,'<li><a href="javascript:;">失连（'+info.loseNum+'）</a></li>'
									,'<li><a href="javascript:;">正常（'+info.normalNum+'）</a></li>'
									,'</ul></div>'
									,'<span class="btnB"><a href="javascript:;" class="lsBtn" layim-event="checkhos">查看检查历史</a></span>'
								,'</div>'
								,'<div class="uInfo">'
									,'<h3 class="cpy_tit">'+info.relatedName+'</h3>'
									,'<ul>'
									,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe612;</i>:'+info.post+'</li>'
									,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe63b;</i>:'+info.phone+'</li>'
									,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe611;</i>:'+info.email+'</li>'
									,'</ul>'
								,'</div> </div>'].join('');
					}else if(status == 1){
						var html = ['<div class="boxInfo">'
						            ,'<div class="uInfo">'
									,'<h3 class="cpy_tit">'+info.relatedName+'</h3>'
									,'<ul>'
									,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe612;</i>:'+info.post+'</li>'
									,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe63b;</i>:'+info.phone+'</li>'
									,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe611;</i>:'+info.email+'</li>'
									,'</ul>'
								,'</div> </div>'].join('');
					
						var html = ['<div class="boxInfo">'
						            ,'<h3 class="cpy_tit">'+info.relatedName+'</h3>'
									,'<b class="wx_t"><span>综合风险等级：</span><em class="cor Cyel"></em></b>'    
									,'<b class="wx_t">未整改隐患：<em class="yhnum">19/20</em></b>' 
									,'<b class="wx_t t10">物联设备异常状态：</b>'
									,'<div class="ulcon"><ul>'
									,'<li><a href="javascript:;">火警（'+info.fireUnConfirmNum+'）</a></li>'
									,'<li><a href="javascript:;">报警（'+info.alarmNum+'）</a></li>'
									,'<li><a href="javascript:;">故障（'+info.faultNum+'）</a></li>'
									,'<li><a href="javascript:;">误报（'+info.falseNum+'）</a></li>'
									,'<li><a href="javascript:;">失连（'+info.loseNum+'）</a></li>'
									,'<li><a href="javascript:;">正常（'+info.normalNum+'）</a></li>'
									,'</ul></div>'
									,'<span class="btnB"><a href="javascript:;" class="lsBtn" layim-event="checkhos">查看检查历史</a></span>'
								,'</div>'
								,'<div class="uInfo">'
									,'<h3 class="cpy_tit">'+info.relatedName+'</h3>'
									,'<ul>'
									,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe612;</i>:'+info.post+'</li>'
									,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe63b;</i>:'+info.phone+'</li>'
									,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe611;</i>:'+info.email+'</li>'
									,'</ul>'
								,'</div> </div>'].join('');
						}*/
    				var em = "";
    				if(info.riskGrade == 1){
    					//正常
    					em="<em class='cor Cgre'  ></em>";
    				}else if(info.riskGrade == 2){
    					//橙色预警
    					em="<em class='cor Cyel'></em>";
    				}else if(info.riskGrade == 3){
    					//红色预警
    					em="<em class='cor Cred'></em>";
    				}else {
    					//未检查
    					em="<em class='cor Cwhite'></em>";
    				}
    				var html = ['<div class="boxInfo">'
    				            ,'<h3 class="cpy_tit">'+info.relatedName+'</h3>'
    				            ,'<b class="wx_t"><span>综合风险等级：</span>'+em+'</b>'    
    				            ,'<b class="wx_t">未整改隐患：<em class="yhnum">'+info.unmodified+'/'+info.dangerCount+'</em></b>' 
    				            ,'<b class="wx_t t10">物联设备异常状态：</b>'
    				           /* ,'<div class="ulcon"><ul>'
    				            ,'<li><a href="javascript:;">火警（'+info.fireUnConfirmNum+'）</a></li>'
    				            ,'<li><a href="javascript:;">报警（'+info.alarmNum+'）</a></li>'
    				            ,'<li><a href="javascript:;">故障（'+info.faultNum+'）</a></li>'
    				            ,'<li><a href="javascript:;">误报（'+info.falseNum+'）</a></li>'
    				            ,'<li><a href="javascript:;">失连（'+info.loseNum+'）</a></li>'
    				            ,'<li><a href="javascript:;">正常（'+info.normalNum+'）</a></li>'
    				            ,'</ul></div>'*/
    				            ,'<div class="ulcon" style="color:#ff8a00"><ul>'
    				            ,'<li>火警（'+info.fireUnConfirmNum+'）</li>'
    				            ,'<li>报警（'+info.alarmNum+'）</li>'
    				            ,'<li>故障（'+info.faultNum+'）</li>'
    				            ,'<li>误报（'+info.falseNum+'）</li>'
    				            ,'<li>失连（'+info.loseNum+'）</li>'
    				            ,'<li>正常（'+info.normalNum+'）</li>'
    				            ,'</ul></div>'
    				            //,'<span class="btnB"><a href="javascript:;" class="lsBtn" layim-event="checkhos">查看检查历史</a></span>'
    				            ,'</div>'
    				            ,'<div class="uInfo">'
    				            ,'<h3 class="cpy_tit">'+info.relatedName+'</h3>'
    				            ,'<ul>'
    				            ,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe612;</i>：'+info.post+'</li>'
    				            ,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe63b;</i>：'+info.phone+'</li>'
    				            ,'<li><i class="layui-icon" style="font-size: 14px; color: #999999;">&#xe611;</i>：'+info.email+'</li>'
    				            ,'</ul>'
    				            ,'</div> </div>'].join('');
    				$(html).appendTo("body .scon"); // 追加数据
    			}
    		});
    	}
    }
	
	
    if(chat[0]){
      var list = layimChat.find('.layim-chat-list');
      var listThat = list.find('.layim-chatlist-'+ data.type + data.id);
      var hasFull = layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin');
      var chatBox = chat.children('.layim-chat-box');
      
      //如果是最小化，则还原窗口
      if(layimChat.css('display') === 'none'){
        layimChat.show();
      }
      
      if(layimMin){
        layer.close(layimMin.attr('times'));
      }
   
      //如果出现多个聊天面板
      if(list.find('li').length === 1 && !listThat[0]){
        hasFull || layimChat.css('width', 800);
        list.css({
          height: layimChat.height()
        }).show();
        chatBox.css('margin-left', '200px');
      }
      
      //打开的是非当前聊天面板，则新增面板
      
	  if(!listThat[0]){
	        list.append(laytpl(elemChatList).render(render));
	        chatBox.append(laytpl(elemTpl1).render(render));//    zdst修改：动态加载聊天模板
	        syncGray(data);
	        resizeChat();	       
	      }

      

      changeChat(list.find('.layim-chatlist-'+ data.type + data.id));
      listThat[0] || viewChatlog();
      setHistory(data);
      hotkeySend();
      
      return chatIndex;
    }
    
    render.first = !0;
    
    var index = chatIndex = layer.open({
      type: 1
      ,area: '600px'
      ,skin: 'layui-box layui-layim-chat'
      ,id: 'layui-layim-chat'
      ,title: '&#8203;'
      ,shade: false
      ,maxmin: true
      ,offset: data.offset || 'auto'
      ,anim: data.anim || 0
      ,closeBtn: cache.base.brief ? false : 1
     //zdst修改：动态弹出聊天模板
      ,content: laytpl('<ul class="layui-unselect layim-chat-list">'+ elemChatList +'</ul><div class="layim-chat-box">' + elemTpl1 + '</div>').render(render)
      ,success: function(layero){
        layimChat = layero;
        
        layero.css({
          'min-width': '500px'
          ,'min-height': '420px'
        });
        
        syncGray(data);
        
        typeof data.success === 'function' && data.success(layero);
        
        hotkeySend();
        setSkin(layero);
        setHistory(data);
        
        viewChatlog();
        showOffMessage();
        
        //聊天窗口的切换监听
        layui.each(call.chatChange, function(index, item){
          item && item(thisChat());
        });
        
        //查看大图
        layero.on('dblclick', '.layui-layim-photos', function(){
          var src = this.src;
          layer.close(popchat.photosIndex);
          layer.photos({
            photos: {
              data: [{
                "alt": "大图模式",
                "src": src
              }]
            }
            ,shade: 0.01
            ,closeBtn: 2
            ,anim: 0
            ,resize: false
            ,success: function(layero, index){
               popchat.photosIndex = index;
            }
          });
        });
      }
      ,full: function(layero){
        layer.style(index, {
          width: '100%'
          ,height: '100%'
        }, true);
        resizeChat();
      }
      ,resizing: resizeChat
      ,restore: resizeChat
      ,min: function(){
        setChatMin();
        return false;
      }
      ,end: function(){
        layer.closeAll('tips');
        layimChat = null;
      }
    });
    return index;
  };
  
  //同步置灰状态
  var syncGray = function(data){
    $('.layim-'+data.type+data.id).each(function(){
      if($(this).hasClass('layim-list-gray')){
        layui.layim.setFriendStatus(data.id, 'offline'); 
      }
    });
  };
  
  //重置聊天窗口大小
  var resizeChat = function(){
    var list = layimChat.find('.layim-chat-list')
    ,chatMain = layimChat.find('.layim-chat-main')
    ,noticeMain = layimChat.find('.noticeChat')//zdst:获取公告面板
    ,rightSide = layimChat.find('.right_sidebar')//zdst:获取右边信息面板
    ,chatHeight = layimChat.height();
    var noticechat =  chatMain.hasClass("noticeChat");//    zdst：判断是否为公告面板
    list.css({
      height: chatHeight
    });
//    zdst修改：最大化、切换聊天面板时避免影响公告高度
    if(!noticechat){
    	chatMain.css({
  	      height: chatHeight - 20 - 80 - 158
  	    });
  	  	rightSide.css({
  	      height: chatHeight - 20 - 80
	    })
    }else{
    	chatMain.css({
    	  height: chatHeight - 20 - 80 - 158
    	});
    	noticeMain.css({
	      height: chatHeight - 20 - 80
	    });
	    rightSide.css({
  	      height: chatHeight - 20 - 80
	    })
    }
	    

  };

  //设置聊天窗口最小化 & 新消息提醒
  var setChatMin = function(newMsg){
    var thatChat = newMsg || thisChat().data, base = layui.layim.cache().base;
    if(layimChat && !newMsg){
      layimChat.hide();
    }
    layer.close(setChatMin.index);    
    setChatMin.index = layer.open({
      type: 1
      ,title: false
      ,skin: 'layui-box layui-layim-min'
      ,shade: false
      ,closeBtn: false
      ,anim: thatChat.anim || 2
      ,offset: 'b'
      ,move: '#layui-layim-min'
      ,resize: false
      ,area: ['182px', '50px']
      ,content: '<img id="layui-layim-min" src="'+ thatChat.avatar +'"><span>'+ thatChat.name +'</span>'
      ,success: function(layero, index){
        if(!newMsg) layimMin = layero;
        
        if(base.minRight){
          layer.style(index, {
            left: $(window).width() - layero.outerWidth() - parseFloat(base.minRight)
          });
        }
        
        layero.find('.layui-layer-content span').on('click', function(){
          layer.close(index);
          newMsg ? layui.each(cache.chat, function(i, item){
            popchat(item);
          }) : layimChat.show();
          if(newMsg){
            cache.chat = [];
            chatListMore();
          }
        });
        layero.find('.layui-layer-content img').on('click', function(e){
          stope(e);
        });
      }
    });
  };
  
  
  //打开添加好友、群组面板、好友分组面板
  var popAdd = function(data, type){
    data = data || {};
    layer.close(popAdd.index);
    return popAdd.index = layer.open({
      type: 1
      ,area: '430px'
      ,title: {
        friend: '添加好友'
        ,group: '加入群组'
      }[data.type] || ''
      ,shade: false
      ,resize: false
      ,btn: type ? ['确认', '取消'] : ['发送申请', '关闭']
      ,content: laytpl(elemAddTpl).render({
        data: {
          name: data.username || data.groupname
          ,avatar: data.avatar
          ,group: data.group || parent.layui.layim.cache().friend || []
          ,type: data.type
        }
        ,type: type
      })
      ,yes: function(index, layero){
        var groupElem = layero.find('#LAY_layimGroup')
        ,remarkElem = layero.find('#LAY_layimRemark')
        if(type){
          data.submit && data.submit(groupElem.val(), index);
        } else {
          data.submit && data.submit(groupElem.val(), remarkElem.val(), index);
        }
      }
    });
  };
  
  //切换聊天
  var changeChat = function(elem, del){
    elem = elem || $('.layim-chat-list .' + THIS);
    var index = elem.index() === -1 ? 0 : elem.index();
    var str = '.layim-chat', cont = layimChat.find(str).eq(index);
	var str2 = '.right_sidebar', cont2 = layimChat.find(str2).eq(index);
    var hasFull = layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin');

    if(del){
      
      //如果关闭的是当前聊天，则切换聊天焦点
      if(elem.hasClass(THIS)){
        changeChat(index === 0 ? elem.next() : elem.prev());
      }
      
      var length = layimChat.find(str).length;
      
      //关闭聊天界面
      if(length === 1){      
        return layer.close(chatIndex);
      }
      
      elem.remove();
      cont.remove();
	  cont2.remove();
      
      //只剩下1个列表，隐藏左侧区块
      if(length === 2){
        layimChat.find('.layim-chat-list').hide();
        if(!hasFull){
          layimChat.css('width', '600px');
        }
        layimChat.find('.layim-chat-box').css('margin-left', 0);
      } 
      
      return false;
    }
    
    elem.addClass(THIS).siblings().removeClass(THIS);
    cont.addClass(SHOW).siblings(str).removeClass(SHOW);
	cont2.addClass(SHOW).siblings(str2).removeClass(SHOW);
    cont.find('textarea').focus();
    
    //聊天窗口的切换监听
    layui.each(call.chatChange, function(index, item){
      item && item(thisChat());
    });
    showOffMessage();
  };
  
  //展示存在队列中的消息
  var showOffMessage = function(){
    var thatChat = thisChat();
    var message = cache.message[thatChat.data.type + thatChat.data.id];
    if(message){
      //展现后，删除队列中消息
      delete cache.message[thatChat.data.type + thatChat.data.id];
    }
  };
  
  //获取当前聊天面板
  var thisChat = function(){
    if(!layimChat) return;
    var index = $('.layim-chat-list .' + THIS).index();
    var cont = layimChat.find('.layim-chat').eq(index);
    var to = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
    return {
      elem: cont
      ,data: to
      ,textarea: cont.find('textarea')
    };
  };
  
  //记录初始背景
  var setSkin = function(layero){
    var local = layui.data('layim')[cache.mine.id] || {}
    ,skin = local.skin;
    layero.css({
      'background-image': skin ? 'url('+ skin +')' : function(){
        return cache.base.initSkin 
          ? 'url('+ (layui.cache.dir+'css/modules/layim/skin/'+ cache.base.initSkin) +')'
        : 'none';
      }()
    });
  };

  //记录历史会话
  var setHistory = function(data){
    var local = layui.data('layim')[cache.mine.id] || {};
    var obj = {}, history = local.history || {};
    var is = history[data.type + data.id];
    
    if(!layimMain) return;
    
    var historyElem = layimMain.find('.layim-list-history');

    data.historyTime = new Date().getTime();
    history[data.type + data.id] = data;
  
    local.history = history;
    
    layui.data('layim', {
      key: cache.mine.id
      ,value: local
    });

    if(is) return;

    obj[data.type + data.id] = data;
    var historyList = laytpl(listTpl({
      type: 'history'
      ,item: 'd.data'
    })).render({data: obj});
    historyElem.prepend(historyList);
    historyElem.find('.layim-null').remove();
  };
  
  //发送消息
  var sendMessage = function(){
    var data = {
      username: cache.mine ? cache.mine.username : '访客'
      ,avatar: cache.mine ? cache.mine.avatar : (layui.cache.dir+'css/pc/layim/skin/logo.jpg')
      ,id: cache.mine ? cache.mine.id : null
      ,mine: true
    };
    var thatChat = thisChat(), ul = thatChat.elem.find('.layim-chat-main ul');
    var maxLength = cache.base.maxLength || 3000;
    data.content = thatChat.textarea.val();
    if(data.content.replace(/\s/g, '') !== ''){
      
      if(data.content.length > maxLength){
        return layer.msg('内容最长不能超过'+ maxLength +'个字符')
      }
      
      ul.append(laytpl(elemChatMain).render(data));
      
      var param = {
        mine: data
        ,to: thatChat.data
      }, message = {
        username: param.mine.username
        ,avatar: param.mine.avatar
        ,id: param.to.id
        ,type: param.to.type
        ,content: param.mine.content
        ,timestamp: new Date().getTime()
        ,mine: true
      };
      pushChatlog(message);
      
      layui.each(call.sendMessage, function(index, item){
        item && item(param);
      });
    }
    chatListMore();
    thatChat.textarea.val('').focus();
  };
  
  //桌面消息提醒
  var notice = function(data){
    data = data || {};
    if (window.Notification){
      if(Notification.permission === 'granted'){
        var notification = new Notification(data.title||'', {
          body: data.content||''
          ,icon: data.avatar||'http://tp2.sinaimg.cn/5488749285/50/5719808192/1'
        });
      }else {
        Notification.requestPermission();
      };
    }
  };
  
  //消息声音提醒
  var voice = function(data) {
    if(device.ie && device.ie < 9) return;
    var audio = document.createElement("audio");
	 if(data.username == "设备报警通知"){
		 audio.src = layui.cache.dir+'css/modules/layim/voice/'+ cache.base.voice2;
	 }else{
		 audio.src = layui.cache.dir+'css/modules/layim/voice/'+ cache.base.voice1;
	 }
    audio.play();
  };
  
  //接受消息
  var messageNew = {}, getMessage = function(data){
 	/* zdst */  setHistory(data); //添加历史会话
    data = data || {};   
    var elem = $('.layim-chatlist-'+ data.type + data.id);
    var group = {}, index = elem.index();
    
    data.timestamp = data.timestamp || new Date().getTime();
    if(data.fromid == cache.mine.id){
      data.mine = true;
    }
    data.system || pushChatlog(data);
    messageNew = JSON.parse(JSON.stringify(data));    
    if(cache.base.voice1 || cache.base.voice2){    	
    	 voice(data);
    }
    
    if((!layimChat && data.content) || index === -1){
      if(cache.message[data.type + data.id]){
        cache.message[data.type + data.id].push(data)
      } else {
        cache.message[data.type + data.id] = [data];
        
        //记录聊天面板队列
        if(data.type === 'friend'){
          var friend;
          layui.each(cache.friend, function(index1, item1){
            layui.each(item1.list, function(index, item){
              if(item.id == data.id){
                item.type = 'friend';
                item.name = item.username;
                cache.chat.push(item);
                return friend = true;
              }
            });
            if(friend) return true;
          });
          if(!friend){
            data.name = data.username;
            data.temporary = true; //临时会话
            cache.chat.push(data);
          }
        } else if(data.type === 'group'){
          var isgroup;
          layui.each(cache.group, function(index, item){
            if(item.id == data.id){
              item.type = 'group';
              item.name = item.groupname;
              cache.chat.push(item);
              return isgroup = true;
            }
          });
          if(!isgroup){
            data.name = data.groupname;
            cache.chat.push(data);
          }
        } else {
          data.name = data.name || data.username || data.groupname;
          cache.chat.push(data);
        }
      }
      if(data.type === 'group'){
        layui.each(cache.group, function(index, item){
          if(item.id == data.id){
            group.avatar = item.avatar;
            return true;
          }
        });
      }
      if(!data.system){
        if(cache.base.notice){
          notice({
            title: '来自 '+ data.username +' 的消息'
            ,content: data.content
            ,avatar: group.avatar || data.avatar
          });
        }
        return setChatMin({
          name: '收到新消息'
          ,avatar: group.avatar || data.avatar
          ,anim: 6
        });
      }
    }

    if(!layimChat) return;
    
    //接受到的消息不在当前Tab
    var thatChat = thisChat();
    if(thatChat.data.type + thatChat.data.id !== data.type + data.id){
      elem.addClass('layui-anim layer-anim-06');
      setTimeout(function(){
        elem.removeClass('layui-anim layer-anim-06')
      }, 300);
    }
    
    var cont = layimChat.find('.layim-chat').eq(index);
    var ul = cont.find('.layim-chat-main ul');
    
    //系统消息
    if(data.system){
      if(index !== -1){
        ul.append('<li class="layim-chat-system"><span>'+ data.content +'</span></li>');
      }
    } else if(data.content.replace(/\s/g, '') !== ''){
      ul.append(laytpl(elemChatMain).render(data));
    }
    
    chatListMore();
  };
  
  //消息盒子的提醒
  var ANIM_MSG = 'layui-anim-loop layer-anim-05', msgbox = function(num){
    var msgboxElem = layimMain.find('.layim-tool-msgbox');
    msgboxElem.find('span').addClass(ANIM_MSG).html(num);
  };
  
  //存储最近MAX_ITEM条聊天记录到本地
  var pushChatlog = function(message){
    var local = layui.data('layim')[cache.mine.id] || {};
    local.chatlog = local.chatlog || {};
    var thisChatlog = local.chatlog[message.type + message.id];
    if(thisChatlog){
      //避免浏览器多窗口时聊天记录重复保存
      var nosame;
      layui.each(thisChatlog, function(index, item){
        if((item.timestamp === message.timestamp 
          && item.type === message.type
          && item.id === message.id
        && item.content === message.content)){
          nosame = true;
        }
      });
      if(!(nosame || message.fromid == cache.mine.id)){
        thisChatlog.push(message);
      }
      if(thisChatlog.length > MAX_ITEM){
        thisChatlog.shift();
      }
    } else {
      local.chatlog[message.type + message.id] = [message];
    }
    layui.data('layim', {
      key: cache.mine.id
      ,value: local
    });
  };
  
  //渲染本地最新聊天记录到相应面板
  var viewChatlog = function(){
    var local = layui.data('layim')[cache.mine.id] || {}
    ,thatChat = thisChat(), chatlog = local.chatlog || {}
    ,ul = thatChat.elem.find('.layim-chat-main ul');
    layui.each(chatlog[thatChat.data.type + thatChat.data.id], function(index, item){
      ul.append(laytpl(elemChatMain).render(item));
    });
    chatListMore();
  };

  //添加好友或群
  var addList = function(data){
    var obj = {}, has, listElem = layimMain.find('.layim-list-'+ data.type);
    
    if(cache[data.type]){
      if(data.type === 'friend'){
        layui.each(cache.friend, function(index, item){
          if(data.groupid == item.id){
            //检查好友是否已经在列表中
            layui.each(cache.friend[index].list, function(idx, itm){
              if(itm.id == data.id){
                return has = true
              }
            });
            if(has) return layer.msg('好友 ['+ (data.username||'') +'] 已经存在列表中',{anim: 6});
            cache.friend[index].list = cache.friend[index].list || [];
            obj[cache.friend[index].list.length] = data;
            data.groupIndex = index;
            cache.friend[index].list.push(data); //在cache的friend里面也增加好友
            return true;
          }
        });
      } else if(data.type === 'group'){
        //检查群组是否已经在列表中
        layui.each(cache.group, function(idx, itm){
          if(itm.id == data.id){
            return has = true
          }
        });
        if(has) return layer.msg('您已是 ['+ (data.groupname||'') +'] 的群成员',{anim: 6});
        obj[cache.group.length] = data;
        cache.group.push(data);
      }
    }
    
    if(has) return;

    var list = laytpl(listTpl({
      type: data.type
      ,item: 'd.data'
      ,index: data.type === 'friend' ? 'data.groupIndex' : null
    })).render({data: obj});

    if(data.type === 'friend'){
      var li = listElem.find('>li').eq(data.groupIndex);
      li.find('.layui-layim-list').append(list);
      li.find('.layim-count').html(cache.friend[data.groupIndex].list.length); //刷新好友数量
      //如果初始没有好友
      if(li.find('.layim-null')[0]){
        li.find('.layim-null').remove();
      }
    } else if(data.type === 'group'){
      listElem.append(list);
      //如果初始没有群组
      if(listElem.find('.layim-null')[0]){
        listElem.find('.layim-null').remove();
      }
    }
  };
  
  //移出好友或群
  var removeList = function(data){
    var listElem = layimMain.find('.layim-list-'+ data.type);
    var obj = {};
    if(cache[data.type]){
      if(data.type === 'friend'){
        layui.each(cache.friend, function(index1, item1){
          layui.each(item1.list, function(index, item){
            if(data.id == item.id){
              var li = listElem.find('>li').eq(index1);
              var list = li.find('.layui-layim-list>li');
              li.find('.layui-layim-list>li').eq(index).remove();
              cache.friend[index1].list.splice(index, 1); //从cache的friend里面也删除掉好友
              li.find('.layim-count').html(cache.friend[index1].list.length); //刷新好友数量  
              //如果一个好友都没了
              if(cache.friend[index1].list.length === 0){
                li.find('.layui-layim-list').html('<li class="layim-null">该分组下已无好友了</li>');
              }
              return true;
            }
          });
        });
      } else if(data.type === 'group'){
        layui.each(cache.group, function(index, item){
          if(data.id == item.id){
            listElem.find('>li').eq(index).remove();
            cache.group.splice(index, 1); //从cache的group里面也删除掉数据
            //如果一个群组都没了
            if(cache.group.length === 0){
              listElem.html('<li class="layim-null">暂无群组</li>');
            }
            return true;
          }
        });
      }
    }
  };
  
  //查看更多记录
  var chatListMore = function(){
    var thatChat = thisChat(), chatMain = thatChat.elem.find('.layim-chat-main');
    var ul = chatMain.find('ul');
    var length = ul.find('li').length;
    
    if(length >= MAX_ITEM){
      var first = ul.find('li').eq(0);
      if(!ul.prev().hasClass('layim-chat-system')){
        ul.before('<div class="layim-chat-system"><span layim-event="chatLog">查看更多记录</span></div>');
      }
      if(length > MAX_ITEM){
        first.remove();
      }
    }
    chatMain.scrollTop(chatMain[0].scrollHeight + 1000);
    chatMain.find('ul li:last').find('img').load(function(){
      chatMain.scrollTop(chatMain[0].scrollHeight+1000);
    });
  };
  
  //快捷键发送
  var hotkeySend = function(){
    var thatChat = thisChat(), textarea = thatChat.textarea;
    textarea.focus();
    textarea.off('keydown').on('keydown', function(e){
      var local = layui.data('layim')[cache.mine.id] || {};
      var keyCode = e.keyCode;
      if(local.sendHotKey === 'Ctrl+Enter'){
        if(e.ctrlKey && keyCode === 13){
          sendMessage();
        }
        return;
      }
      if(keyCode === 13){
        if(e.ctrlKey){
          return textarea.val(textarea.val()+'\n');
        }
        if(e.shiftKey) return;
        e.preventDefault();
        sendMessage();
      }
    });
  };
  
  //表情库
  var faces = function(){
    var alt = ["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]"], arr = {};
    layui.each(alt, function(index, item){
      arr[item] = layui.cache.dir + 'images/face/'+ index + '.gif';
    });
    return arr;
  }();
  
  
  var stope = layui.stope; //组件事件冒泡
  
  //在焦点处插入内容
  var focusInsert = function(obj, str){
    var result, val = obj.value;
    obj.focus();
    if(document.selection){ //ie
      result = document.selection.createRange(); 
      document.selection.empty(); 
      result.text = str; 
    } else {
      result = [val.substring(0, obj.selectionStart), str, val.substr(obj.selectionEnd)];
      obj.focus();
      obj.value = result.join('');
    }
  };
  
  //事件
  var anim = 'layui-anim-upbit', events = {
    //在线状态
    status: function(othis, e){
      var hide = function(){
        othis.next().hide().removeClass(anim);
      };
      var type = othis.attr('lay-type');
      if(type === 'show'){
        stope(e);
        othis.next().show().addClass(anim);
        $(document).off('click', hide).on('click', hide);
      } else {
        var prev = othis.parent().prev();
        othis.addClass(THIS).siblings().removeClass(THIS);
        prev.html(othis.find('cite').html());
        prev.removeClass('layim-status-'+(type === 'online' ? 'hide' : 'online'))
        .addClass('layim-status-'+type);
        layui.each(call.online, function(index, item){
          item && item(type);
        });
      }
    }
    
    //编辑签名
    ,sign: function(){
      var input = layimMain.find('.layui-layim-remark');
      input.on('change', function(){
        var value = this.value;
        layui.each(call.sign, function(index, item){
          item && item(value);
        });
      });
      input.on('keyup', function(e){
        var keyCode = e.keyCode;
        if(keyCode === 13){
          this.blur();
        }
      });
    }
    
    //大分组切换
    ,tab: function(othis){
      var index, main = '.layim-tab-content';
      var tabs = layimMain.find('.layui-layim-tab>li');
      typeof othis === 'number' ? (
        index = othis
        ,othis = tabs.eq(index)
      ) : (
        index = othis.index()
      );
      index > 2 ? tabs.removeClass(THIS) : (
        events.tab.index = index
        ,othis.addClass(THIS).siblings().removeClass(THIS)
      )
      layimMain.find(main).eq(index).addClass(SHOW).siblings(main).removeClass(SHOW);
    }
    
    //展开联系人分组
    ,spread: function(othis){
      var type = othis.attr('lay-type');
      var spread = type === 'true' ? 'false' : 'true';
      var local = layui.data('layim')[cache.mine.id] || {};
      othis.next()[type === 'true' ? 'removeClass' : 'addClass'](SHOW);
      local['spread' + othis.parent().index()] = spread;
      layui.data('layim', {
        key: cache.mine.id
        ,value: local
      });
      othis.attr('lay-type', spread);
      othis.find('.layui-icon').html(spread === 'true' ? '&#xe61a;' : '&#xe602;');
    }

    //搜索
    ,search: function(othis){
      var search = layimMain.find('.layui-layim-search');
      var main = layimMain.find('#layui-layim-search');
      var input = search.find('input'), find = function(e){
        var val = input.val().replace(/\s/);
        if(val === ''){
          events.tab(events.tab.index|0);
        } else {
          var data = [], friend = cache.friend || [];
          var group = cache.group || [], html = '';
          for(var i = 0; i < friend.length; i++){
            for(var k = 0; k < (friend[i].list||[]).length; k++){
              if(friend[i].list[k].username.indexOf(val) !== -1){
                friend[i].list[k].type = 'friend';
                friend[i].list[k].index = i;
                friend[i].list[k].list = k;
                data.push(friend[i].list[k]);
              }
            }
          }
          for(var j = 0; j < group.length; j++){
            if(group[j].groupname.indexOf(val) !== -1){
              group[j].type = 'group';
              group[j].index = j;
              group[j].list = j;
              data.push(group[j]);
            }
          }
          if(data.length > 0){
            for(var l = 0; l < data.length; l++){
              html += '<li layim-event="chat" data-type="'+ data[l].type +'" data-index="'+ data[l].index +'" data-list="'+ data[l].list +'"><img src="'+ data[l].avatar +'"><span>'+ (data[l].username || data[l].groupname || '佚名') +'</span><p>'+ (data[l].remark||data[l].sign||'') +'</p></li>';
            }
          } else {
            html = '<li class="layim-null">无搜索结果</li>';
          }
          main.html(html);
          events.tab(3);
        }
      };
      if(!cache.base.isfriend && cache.base.isgroup){
        events.tab.index = 1;
      } else if(!cache.base.isfriend && !cache.base.isgroup){
        events.tab.index = 2;
      }
      search.show();
      input.focus();
      input.off('keyup', find).on('keyup', find);
    }

    //关闭搜索
    ,closeSearch: function(othis){
      othis.parent().hide();
      events.tab(events.tab.index|0);
    }
    
    //消息盒子
    ,msgbox: function(){
      var msgboxElem = layimMain.find('.layim-tool-msgbox');
      layer.close(events.msgbox.index);
      msgboxElem.find('span').removeClass(ANIM_MSG).html('');
      return events.msgbox.index = layer.open({
        type: 2
        ,title: '消息盒子'
        ,shade: false
        ,maxmin: true
        ,area: ['600px', '520px']
        ,skin: 'layui-box layui-layer-border'
        ,resize: false
        ,content: cache.base.msgbox
      });
    }
    
    //弹出查找页面
    ,find: function(){
      layer.close(events.find.index);
      return events.find.index = layer.open({
        type: 2
        ,title: '查找'
        ,shade: false
        ,maxmin: true
        ,area: ['1000px', '520px']
        ,skin: 'layui-box layui-layer-border'
        ,resize: false
        ,content: cache.base.find
      });
    }
    
    //弹出更换背景
    ,skin: function(){
      layer.open({
        type: 1
        ,title: '更换背景'
        ,shade: false
        ,area: '300px'
        ,skin: 'layui-box layui-layer-border'
        ,id: 'layui-layim-skin'
        ,zIndex: 66666666
        ,resize: false
        ,content: laytpl(elemSkinTpl).render({
          skin: cache.base.skin
        })
      });
    }
    
    //关于
    ,about: function(){
      layer.alert('版本： '+ v + '<br>版权所有：中电数通科技有限公司</a>', {
        title: '关于系统'
        ,shade: false
      });
    }
    
    //生成换肤
    ,setSkin: function(othis){
      var src = othis.attr('src');
      var local = layui.data('layim')[cache.mine.id] || {};
      local.skin = src;
      if(!src) delete local.skin;
      layui.data('layim', {
        key: cache.mine.id
        ,value: local
      });
      try{
        layimMain.css({
          'background-image': src ? 'url('+ src +')' : 'none'
        });
        layimChat.css({
          'background-image': src ? 'url('+ src +')' : 'none'
        });
      } catch(e) {}
      layui.each(call.setSkin, function(index, item){
        var filename = (src||'').replace(layui.cache.dir+'css/modules/layim/skin/', '');
        item && item(filename, src);
      });
    }
    
    //弹出聊天面板
    ,chat: function(othis){
      var local = layui.data('layim')[cache.mine.id] || {};
      var type = othis.data('type'), index = othis.data('index');
      var list = othis.attr('data-list') || othis.index(), data = {};
      if(type === 'friend'){
        data = cache[type][index].list[list];
      } else if(type === 'group'){
        data = cache[type][list];
      } else if(type === 'history'){
        data = (local.history || {})[index] || {};
      }
      data.name = data.name || data.username || data.groupname;
      if(type !== 'history'){
        data.type = type;
      }
      popchat(data);
    }
	
	//弹出 查看检查历史
    ,checkhos: function(){
      layer.open({
        type: 1
        ,title: '检查历史'
        ,shade: false
        ,area: '300px'
        ,skin: 'layui-box layui-layer-border'
        ,id: 'layui-layim-checkHos'
        ,zIndex: 66666666
        ,resize: false
        ,content: '检查历史列表'
		/*laytpl(elemCheckhosTpl).render({
          checkhos: cache.base.checkhos
        })*/
      });
    }
    
    //切换聊天
    ,tabChat: function(othis){
      changeChat(othis);
    }
    
    //关闭聊天列表
    ,closeChat: function(othis, e){
      changeChat(othis.parent(), 1);
      stope(e);
    }, closeThisChat: function(){
      changeChat(null, 1);
    }
    
    //展开群组成员
    ,groupMembers: function(othis, e){
      var icon = othis.find('.layui-icon'), hide = function(){
        icon.html('&#xe61a;');
        othis.data('down', null);
        layer.close(events.groupMembers.index);
      }, stopmp = function(e){stope(e)};
      
      if(othis.data('down')){
        hide();
      } else {
        icon.html('&#xe619;');
        othis.data('down', true);
        events.groupMembers.index = layer.tips('<ul class="layim-members-list"></ul>', othis, {
          tips: 3
          ,time: 0
          ,anim: 5
          ,fixed: true
          ,skin: 'layui-box layui-layim-members'
          ,success: function(layero){
            var members = cache.base.members || {}, thatChat = thisChat()
            ,ul = layero.find('.layim-members-list'), li = '', membersCache = {}
            ,hasFull = layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin')
            ,listNone = layimChat.find('.layim-chat-list').css('display') === 'none';
            if(hasFull){
              ul.css({
                width: $(window).width() - 22 - (listNone || 200)
              });
            }
            members.data = $.extend(members.data, {
              id: thatChat.data.id
            });
            post(members, function(res){
              layui.each(res.list, function(index, item){
                li += '<li data-uid="'+ item.id +'"><a href="javascript:;"><img src="'+ item.avatar +'"><cite>'+ item.username +'</cite></a></li>';
                membersCache[item.id] = item;
              });
              ul.html(li);
              
              //获取群员
              othis.find('.layim-chat-members').html(res.members||(res.list||[]).length + '人');
              
              //私聊
              ul.find('li').on('click', function(){
                var uid = $(this).data('uid'), info = membersCache[uid]
                popchat({
                  name: info.username
                  ,type: 'friend'
                  ,avatar: info.avatar
                  ,id: info.id
                });
                hide();
              });
              
              layui.each(call.members, function(index, item){
                item && item(res);
              });
            });
            layero.on('mousedown', function(e){
              stope(e);
            });
          }
        });
        $(document).off('mousedown', hide).on('mousedown', hide);
        $(window).off('resize', hide).on('resize', hide);
        othis.off('mousedown', stopmp).on('mousedown', stopmp);
      }
    }
    
    //发送聊天内容
    ,send: function(){
      sendMessage();
    }
    
    //设置发送聊天快捷键
    ,setSend: function(othis, e){
      var box = events.setSend.box = othis.siblings('.layim-menu-box')
      ,type = othis.attr('lay-type');
      
      if(type === 'show'){
        stope(e);
        box.show().addClass(anim);
        $(document).off('click', events.setSendHide).on('click', events.setSendHide);
      } else {
        othis.addClass(THIS).siblings().removeClass(THIS);
        var local = layui.data('layim')[cache.mine.id] || {};
        local.sendHotKey = type;
        layui.data('layim', {
          key: cache.mine.id
          ,value: local
        });
        events.setSendHide(e, othis.parent());
      }
    }, setSendHide: function(e, box){
      (box || events.setSend.box).hide().removeClass(anim);
    }
    
    //表情
    ,face: function(othis, e){
      var content = '', thatChat = thisChat();

      for(var key in faces){
        content += '<li title="'+ key +'"><img src="'+ faces[key] +'"></li>';
      }
      content = '<ul class="layui-clear layim-face-list">'+ content +'</ul>';
     
     events.face.index = layer.tips(content, othis, {
        tips: 1
        ,time: 0
        ,fixed: true
        ,skin: 'layui-box layui-layim-face'
        ,success: function(layero){
          layero.find('.layim-face-list>li').on('mousedown', function(e){
            stope(e);
          }).on('click', function(){
            focusInsert(thatChat.textarea[0], 'face' +  this.title + ' ');
            layer.close(events.face.index);
          });
        }
      });
      
      $(document).off('mousedown', events.faceHide).on('mousedown', events.faceHide);
      $(window).off('resize', events.faceHide).on('resize', events.faceHide);
      stope(e);
      
    } ,faceHide: function(){
      layer.close(events.face.index);
    }
    
    //图片或一般文件
    ,image: function(othis){
      var type = othis.data('type') || 'images', api = {
        images: 'uploadImage'
        ,file: 'uploadFile'
      }
      ,thatChat = thisChat(), upload = cache.base[api[type]] || {};
  
      layui.upload({
        url: upload.url || ''
        ,method: upload.type
        ,elem: othis.find('input')[0]
        ,unwrap: true
        ,type: type
        ,success: function(res){
          if(res.code == 0){
            res.data = res.data || {};
            if(type === 'images'){
              focusInsert(thatChat.textarea[0], 'img['+ (res.data.src||'') +']');
            } else if(type === 'file'){
              focusInsert(thatChat.textarea[0], 'file('+ (res.data.src||'') +')['+ (res.data.name||'下载文件') +']');
            }
            sendMessage();
          } else {
            layer.msg(res.msg||'上传失败');
          }
        }
      });
    }
    
    //音频和视频
    ,media: function(othis){
      var type = othis.data('type'), text = {
        audio: '音频'
        ,video: '视频'
      } ,thatChat = thisChat()
      
      layer.prompt({
        title: '请输入网络'+ text[type] + '地址'
        ,shade: false
        ,offset: [
          othis.offset().top - $(window).scrollTop() - 158 + 'px'
          ,othis.offset().left + 'px'
        ]
      }, function(src, index){
        focusInsert(thatChat.textarea[0], type + '['+ src +']');
        sendMessage();
        layer.close(index);
      });
    }
    
    //扩展工具栏
    ,extend: function(othis){
      var filter = othis.attr('lay-filter')
      ,thatChat = thisChat();
      
      layui.each(call['tool('+ filter +')'], function(index, item){
        item && item.call(othis, function(content){
          focusInsert(thatChat.textarea[0], content);
        }, sendMessage, thatChat);
      });
    }
    
    //播放音频
    ,playAudio: function(othis){
      var audioData = othis.data('audio')
      ,audio = audioData || document.createElement('audio')
      ,pause = function(){
        audio.pause();
        othis.removeAttr('status');
        othis.find('i').html('&#xe652;');
      };
      if(othis.data('error')){
        return layer.msg('播放音频源异常');
      }
      if(!audio.play){
        return layer.msg('您的浏览器不支持audio');
      }
      if(othis.attr('status')){   
        pause();
      } else {
        audioData || (audio.src = othis.data('src'));
        audio.play();
        othis.attr('status', 'pause');
        othis.data('audio', audio);
        othis.find('i').html('&#xe651;');
        //播放结束
        audio.onended = function(){
          pause();
        };
        //播放异常
        audio.onerror = function(){
          layer.msg('播放音频源异常');
          othis.data('error', true);
          pause();
        };
      } 
    }
    
    //播放视频
    ,playVideo: function(othis){
      var videoData = othis.data('src')
      ,video = document.createElement('video');
      if(!video.play){
        return layer.msg('您的浏览器不支持video');
      }
      layer.close(events.playVideo.index);
      events.playVideo.index = layer.open({
        type: 1
        ,title: '播放视频'
        ,area: ['460px', '300px']
        ,maxmin: true
        ,shade: false
        ,content: '<div style="background-color: #000; height: 100%;"><video style="position: absolute; width: 100%; height: 100%;" src="'+ videoData +'" loop="loop" autoplay="autoplay"></video></div>'
      });
    }
    
    //聊天记录
    ,chatLog: function(othis){
      var thatChat = thisChat();
      if(!cache.base.chatLog){
        return layer.msg('未开启更多聊天记录');
      }
      layer.close(events.chatLog.index);
      
      return events.chatLog.index = layer.open({
        type: 2
        ,maxmin: true
        ,title: '与 '+ thatChat.data.name +' 的聊天记录'
        ,area: ['450px', '100%']
        ,shade: false
        ,offset: 'rb'
        ,skin: 'layui-box'
        ,anim: 2
        ,id: 'layui-layim-chatlog'
        ,content: cache.base.chatLog + '?id=' + thatChat.data.id + '&type=' + thatChat.data.type
        //
      });
      
     /* return events.chatLog.index  = parent.layer.open({
          type: 2
          ,maxmin: true
          ,title: '与 '+ thatChat.data.name +' 的聊天记录'
          ,area: ['450px', '100%']
	      ,shade: false
	      ,offset: 'rb'
	      ,skin: 'layui-box'
	      ,anim: 2
	      ,id: 'layui-layim-chatlog'
		  ,content:['chat/chatlog/' + thatChat.data.id + "/"+thatChat.data.type , 'no'],
          cancel: function (index) {
          
          }
          
      });*/
      
     /* return events.chatLog.index = parent.layer.open({
          type: 2,
          title: '与 '+ thatChat.data.name +' 的聊天记录',
          area:['500px','680px'],
          maxmin:false,
			closeBtn: 1,
			content:['chat/chatlog/?id=' + thatChat.data.id + "&type="+thatChat.data.type , 'no'],
            cancel: function (index) {
          }
          
      });*/
      
    }
    //根据id查询设备报警 tanjin
    ,into : function(){
    	var id = $(this).attr("data-id");
		console.info("<=========================");
		layer.open({
			type:2,
			title:"处理记录",
			area:['90%','50%'],
			maxmin:false,
			closeBtn: 1,
            content: '/deviceStatusHis/filterPermission/visit/'+ id,
		});
    }
    
    //历史会话右键菜单操作
    ,menuHistory: function(othis, e){
      var local = layui.data('layim')[cache.mine.id] || {};
      var parent = othis.parent(), type = othis.data('type');
      var hisElem = layimMain.find('.layim-list-history');
      var none = '<li class="layim-null">暂无历史会话</li>'

      if(type === 'one'){
        var history = local.history;
        delete history[parent.data('index')];
        local.history = history;
        layui.data('layim', {
          key: cache.mine.id
          ,value: local
        });
        $('#'+parent.data('id')).remove();
        if(hisElem.find('li').length === 0){
          hisElem.html(none);
        }
      } else if(type === 'all') {
        delete local.history;
        layui.data('layim', {
          key: cache.mine.id
          ,value: local
        });
        hisElem.html(none);
      }
      
      layer.closeAll('tips');
    }
    
  };
  
  //暴露接口
  exports('layim', new LAYIM());

}).addcss(
  'modules/layim/layim.css?v=3.60Pro'
  ,'skinlayimcss'
);
           