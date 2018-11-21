//一般直接写在一个js文件中
layui.use([ 'layer', ], function() {
	var layer = layui.layer;
	
	/**
	 * 地图-获取经纬度
	 */
	$(function(){
		var longitude = $('#longitude', window.parent.document).val();
		var latitude = $('#latitude', window.parent.document).val();
		var zoneFull = $('#zoneFull', window.parent.document).val(); // 获得选出的地址
		var regularLongitude = /^(((\d|[1-9]\d|1[0-7]\d)\.\d{1,6})|(\d|[1-9]\d|1[0-7]\d)|180\.0{1,6}|180)$/;
		var regularLatitude = /^(((\d|[1-8]\d)\.\d{1,6})|(\d|[1-8]\d)|90\.0{1,6}|90)$/;
		
		if(longitude != '' || latitude != ''){
			if (!new RegExp(regularLongitude).test(longitude)) {
               layer.msg('请输入正确的经度');
               return;
           }
			if (!new RegExp(regularLatitude).test(latitude)) {
               layer.msg('请输入正确的纬度');
               return;
           }
		}
		var  map = new BMap.Map("allmap");
		var local = new BMap.LocalSearch(map, {  
	        renderOptions: {  
	            map: map,  
	           autoViewport: true,  
	           selectFirstResult: false  
	        },
	        onSearchComplete: function(results){ 
	            if(local.getStatus() != BMAP_STATUS_SUCCESS){
	            	layer.msg('未找到相关地点', {time: 3000, icon:5});
	            } 
	        },
		});
		map.addControl(new BMap.MapTypeControl({ //添加地图类型控件
			mapTypes:[
	            BMAP_NORMAL_MAP,
	            BMAP_HYBRID_MAP
	        ]}));
		if(longitude == "" || latitude == ""){
			    var systemLng=$("#centerLng",top.document).val();
			    var systemLat=$("#centerLat",top.document).val();
				//map.centerAndZoom("深圳",12);  
			    map.centerAndZoom( new BMap.Point(systemLng,systemLat),12);
	            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
		}else{
		        map.centerAndZoom(new BMap.Point(longitude,latitude), 14);
		        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
			
   		 //显示坐标
         var point = new BMap.Point(longitude,latitude);
   		 var marker = new BMap.Marker(point);
   		 map.addOverlay(marker);
     	}
			//鼠标绘制点
	 	map.addEventListener("click",function(e){
			 $('#longitude', window.parent.document).val(e.point.lng)
			 $('#latitude', window.parent.document).val(e.point.lat)
			
			 //显示坐标
			 map.clearOverlays(); // 清除覆盖物
			 var point = new BMap.Point(e.point.lng,e.point.lat);
       		 var marker = new BMap.Marker(point);
       		 map.addOverlay(marker);
		}); 
	 	
	 	// 地域查询
		$(".schBtn").click(function(){
			var value = $(".schInput").val().trim();
			if(value != "") local.search(value);
		});
	})
	

	
    });