layui.define(['layer', 'form', 'hand'],function(exports) {
	var layer = layui.layer,form = layui.form();
	var hand = layui.hand;
	var longitude,latitude;

	/**
	 * 
	 * 用于获取经纬度
	 * 
	 * 在页面上必须在经度属性中加上id = longitude,纬度中加上id = latitude
	 * 
	 */
	
	var fun ={
			init : function(width,height){
			if (!width){
				width = '90%';
			}
			if (!height){
                height = '90%';
			}
            var layerIndex = layer.open({
                type: 2,
                title: '<strong style="font-size:22px;color: #107ca2;">获取经纬度</strong><strong  style="margin-left:10px;color:#FF7F00 ;"><- -选定坐标后直接关闭窗体- -></strong>',
                area: [width, height],
                content: "/html/common/mapLocation.html",
                success:function(layero, index){
                }
            });
		},
	};

	exports('location', fun);
});