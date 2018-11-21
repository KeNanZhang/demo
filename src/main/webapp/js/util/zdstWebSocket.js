layui.define([ 'layer', 'form' ], function(exports) { // 提示：组件也可以依赖其它组件，如：layui.define('layer',
	// callback);
	var layer = layui.layer;
	var websocket=null;
	var fun = {};
    fun.zdstPush = function(host,port){

    	
    	var socketStatus=false;
    	
    	function checkNetwork(){
    	    Offline.check();
    	    if(!socketStatus){
    	        if(Offline.state === 'up' && websocket.reconnectAttempts>websocket.maxReconnectInterval){
    	            window.location.reload();
    	        }
    	        //o.connection(userName,systemType);
    	    }else{
    	       // websocket.send("{}");
    	    }
    	}
    	
    	var userName="";
    	
        var systemType="";
    	
        var t;
        
    	var o = new Object();
    	
    	o.onmessage=function(fn){
    		websocket.onmessage = function (evnt) {
    			fn(evnt);
    			//console.log("发送消息回执");
    			//websocket.send("xxx");
    		};
    	};
    	o.connection=function(userName,systemType){
    		userName=userName;
    		systemType=systemType;
    		if ('WebSocket' in window) {
    		    websocket = new ReconnectingWebSocket("ws://"+host+":"+port+"/webSocketServer?userName="+userName+"&systemType="+systemType);
    		} else if ('MozWebSocket' in window) {
    		    websocket = new MozWebSocket("ws://"+host+":"+port+"/webSocketServer?userName="+userName+"&systemType="+systemType);
    		} else {
    		    websocket = new SockJS("http://"+host+":"+port+"/sockjs/webSocketServer?userName="+userName+"&systemType="+systemType);
    		}
    			
    		websocket.onopen = function (evnt) {
    			socketStatus=true;
    			clearInterval(t);//去掉定时器
    			t=setInterval(checkNetwork,3000);
    		};
    		websocket.onerror = function (evnt) {
    			console.log("连接断开");
    			socketStatus=false;
    		};
    		websocket.onclose = function (evnt) {
    			console.log("连接出错");
    			socketStatus=false;
    		}
    	};
    	return o ;
    	

    }
	exports('zdstWebSocket', fun);
});