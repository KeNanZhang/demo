/** wangkangsheng 2018-07-24 */
;
//生成环形百分比
function changeHour(value,left,right,mask) {
    var n = value;
    if(n <= 50) {
        left.style.webkitTransform="rotate(" + 3.6 * n + "deg)";
        right.style.opacity = 0;
        mask.style.opacity = 1;
    }else {
        right.style.opacity = 1;
        mask.style.opacity = 0;
        left.style.webkitTransform="rotate(" + 180 + "deg)";
        right.style.webkitTransform="rotate(" + 3.6 * n + "deg)";
    }
}

//by函数接受一个成员名字符串做为参数
//并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
var by = function (name) {
    return function (o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                //return a < b ? -1 : 1;//升序
                return a > b ? -1 : 1;//降序
            }
            //return typeof a < typeof b ? -1 : 1;//升序
            return typeof a > typeof b ? -1 : 1;//降序
        }
        else {
            throw ("error");
        }
    }
};

var EchartsStat = {
    bar: {
        getLineBarOption: function (serData_name,serData_num1,serData_num2,serData_num3,serData_per1,serData_per2,serData_per3) {
            return{
                color: ['#FC9372','#62A7CF','#61D79B'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                /*toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },*/
                legend: {
                    data:['社会单位消防检查','三小场所监督检查','社会自我评估','社会单位消防检查率','三小场所监督检查率','社会自我评估率'],
                    bottom: 10,
                    //left: 'center',
                },
                grid: {
                    left: '30px',
                    right: '30px',
                    //top: '10px',
                    bottom:'80px',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        //data: ['龙城街道','龙岗街道','坂田街道','南湾街道','园山街道','吉华街道','平湖街道','布吉街道','横岗街道','坪地街道','坪山街道'],
                        data: serData_name,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        splitLine:{show: false},//去除网格线
                        type: 'value',
                        name: '检查数',
                        min: 0,
                        max: 800,
                        interval: 100,
                        axisLabel: {
                            //formatter: '{value} ml'
                            formatter: '{value}'
                        },
                        //splitArea : {show : true}//保留网格区域
                    },
                    {
                        splitLine:{show: false},//去除网格线
                        type: 'value',
                        name: '检查率',
                        min: 0,
                        max: 100,
                        interval: 20,
                        axisLabel: {
                            //formatter: '{value} °C'
                            formatter: '{value}'
                        },
                        //splitArea : {show : true}//保留网格区域
                    }
                ],
                series: [
                    {
                        name:'社会单位消防检查',
                        type:'bar',
                        barWidth: '12%',
                        //data:[560, 680, 450, 730, 550, 510, 450, 650, 480, 531, 427]
                        data:serData_num1
                    },
                    {
                        name:'三小场所监督检查',
                        type:'bar',
                        barWidth: '12%',
                        //data:[460, 380, 650, 330, 380, 310, 350, 425, 400, 731, 327]
                        data:serData_num2
                    },
                    {
                        name:'社会自我评估',
                        type:'bar',
                        barWidth: '12%',
                        //data:[660, 480, 250, 430, 780, 510, 670, 550, 330, 431, 627]
                        data:serData_num3
                    },
                    {
                        name:'社会单位消防检查率',
                        type:'line',
                        yAxisIndex: 1,
                        //data:[47, 36, 22, 77, 55, 64, 50, 47, 72, 54, 84]
                        data:serData_per1
                    },
                    {
                        name:'三小场所监督检查率',
                        type:'line',
                        yAxisIndex: 1,
                        //data:[77, 46, 52, 37, 75, 84, 60, 55, 42, 74, 74]
                        data:serData_per2
                    },
                    {
                        name:'社会自我评估率',
                        type:'line',
                        yAxisIndex: 1,
                        //data:[57, 86, 32, 57, 35, 44, 57, 47, 32, 24, 66]
                        data:serData_per3
                    }
                ]
            }
        },

        getPeixunOption: function (name,num1,num2,num3) {
            return{
                color: ['#FC9372','#62A7CF','#61D79B'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    },
                    formatter: function(datas)
                    {
                        var res = datas[0].name + '<br/>', val;
                        for(var i = 0, length = datas.length; i < length; i++) {
                            val = (datas[i].value) + '%';
                            res += datas[i].seriesName + '：' + val + '<br/>';
                        }
                        return res;
                    }
                },
                /*toolbox: {
                 feature: {
                 dataView: {show: true, readOnly: false},
                 magicType: {show: true, type: ['line', 'bar']},
                 restore: {show: true},
                 saveAsImage: {show: true}
                 }
                 },*/
                legend: {
                    data:['重点单位','一般单位','三小单位'],
                    top: 20,
                    //left: 'center',
                },
                grid: {
                    left: '30px',
                    right: '30px',
                    //top: '10px',
                    bottom:'30px',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        //data: ['龙城街道','龙岗街道','坂田街道','南湾街道','园山街道','吉华街道','平湖街道','布吉街道','横岗街道','坪地街道','坪山街道'],
                        data: name,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        splitLine:{show: false},//去除网格线
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 100,
                        interval: 20,
                        axisLabel: {
                            //formatter: '{value} °C'
                            formatter: '{value} %'
                        },
                        //splitArea : {show : true}//保留网格区域
                    }
                ],
                series: [
                    {
                        name:'重点单位',
                        type:'bar',
                        barWidth: '12%',
                        //data:[560, 680, 450, 730, 550, 510, 450, 650, 480, 531, 427]
                        data:num1
                    },
                    {
                        name:'一般单位',
                        type:'bar',
                        barWidth: '12%',
                        //data:[460, 380, 650, 330, 380, 310, 350, 425, 400, 731, 327]
                        data:num2
                    },
                    {
                        name:'三小单位',
                        type:'bar',
                        barWidth: '12%',
                        //data:[660, 480, 250, 430, 780, 510, 670, 550, 330, 431, 627]
                        data:num3
                    }
                ]
            }
        },

        getKaoheOption: function (name,num1,num2) {
            return{
                color: ['#FC9372','#61D79B'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    },
                    formatter: function(datas)
                    {
                        var res = datas[0].name + '<br/>', val;
                        for(var i = 0, length = datas.length; i < length; i++) {
                            val = (datas[i].value) + '%';
                            res += datas[i].seriesName + '：' + val + '<br/>';
                        }
                        return res;
                    }
                },
                /*toolbox: {
                 feature: {
                 dataView: {show: true, readOnly: false},
                 magicType: {show: true, type: ['line', 'bar']},
                 restore: {show: true},
                 saveAsImage: {show: true}
                 }
                 },*/
                legend: {
                    data:['参考率','合格率'],
                    top: 10,
                    //left: 'center',
                },
                grid: {
                    left: '30px',
                    right: '30px',
                    //top: '10px',
                    bottom:'20px',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        //data: ['龙城街道','龙岗街道','坂田街道','南湾街道','园山街道','吉华街道','平湖街道','布吉街道','横岗街道','坪地街道','坪山街道'],
                        data: name,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        splitLine:{show: false},//去除网格线
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 100,
                        interval: 20,
                        axisLabel: {
                            //formatter: '{value} °C'
                            formatter: '{value} %'
                        },
                        //splitArea : {show : true}//保留网格区域
                    }
                ],
                series: [
                    {
                        name:'参考率',
                        type:'bar',
                        barWidth: '22%',
                        //data:[560, 680, 450, 730, 550, 510, 450, 650, 480, 531, 427]
                        data:num1,
                        barGap:'50%',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: '#615a5a'
                                    },
                                    formatter:function(params){
                                        if(params.value==0){
                                            return '';
                                        }else
                                        {
                                            return params.value+"%";
                                        }
                                    }
                                }
                            }
                        },
                    },
                    {
                        name:'合格率',
                        type:'bar',
                        barWidth: '22%',
                        //data:[460, 380, 650, 330, 380, 310, 350, 425, 400, 731, 327]
                        data:num2,
                        barGap:'50%',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: '#615a5a'
                                    },
                                    formatter:function(params){
                                        if(params.value==0){
                                            return '';
                                        }else
                                        {
                                            return params.value+"%";
                                        }
                                    }
                                }
                            }
                        },
                    }
                ]
            }
        }

    }
}
