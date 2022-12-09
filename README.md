#头部组件
<mdHead isBack='{{false}}' title='首页' titleStyle='color:red;'></mdHead>

#底部tab组件
<mdFoot currActive='home'></mdFoot>

#底部弹出搜索组件
#json配置：
"usingComponents": {
	"mdSearch": "/components/search/search"
}
#wxml配置：
<mdSearch id='mdSearch' title='食物名称' bind:bindSearch='bindSearch' bind:bindCheckResult='bindCheckResult'></mdSearch>
#js配置：
#绑定搜索事件
bindSearch(e) {
	//e.detail为输入框的值
	this.selectComponent('#mdSearch').initData([{
		id: 1, name: '盆底百科'
	}, {
		id: 2, name: '麦澜德百科'
	}])
}
#绑定搜索结果点击事件
bindCheckResult(e) {
	//e.detail为选中对象
}

#底部弹出选择组件
#json配置：
"usingComponents": {
    "mdSelect": "/components/select/select"
}
#wxml配置：
<mdSelect id='mdSelect' title='新增指标' dataList='{{dataArr}}' currIndex='{{currIndex}}' bind:bindComplete='bindComplete'></mdSelect>
#js配置：
data: {
    dataArr: ['腰臀比0', '蛋白质1', '肥胖判定2', '肌肉量3', '总能量需要量4', '未激活5', '伽卡碍事6', '妈妈说授卡是7'],
    currIndex: 4
},
bindComplete: function (e) {
    console.log('bindComplete-index:', e.detail)
}
this.selectComponent('#mdSelect').show()

#趋势图组件
#json配置：
"usingComponents": {
    "mdTrendChart": "/components/trendChart/trendChart"
}
#wxml配置：
<mdTrendChart id='mdTrendChart' style='width: 350rpx; height: 180rpx;' canvasW='350' canvasH='180' dataList='{{chartArr}}'></mdTrendChart>
#js配置：
data: {
	chartArr: ['35.1', '65.6', '62.3', '40.4', '62.5', '70.2', '95.2']
}
this.selectComponent('#mdTrendChart').beginDraw({ //开始绘图，需代码触发
	successFun: ()=> {},
	failFun: ()=> {}
})

#折线图组件
#json配置：
"usingComponents": {
	"mdLineChart": "/components/lineChart/lineChart"
}
#wxml配置：
<mdLineChart id='mdLineChart' style='position: absolute; top: 300rpx; left: 30rpx; width: 690rpx; height: 590rpx;' canvasW='690' canvasH='590' xData='{{xData}}' yData='{{yData}}' dataList='{{dataArr}}' color='#CD5B5C' markType='{{type}}'></mdLineChart>
#js配置：
data: {
	xData: ['2.21', '2.22', '2.23', '2.24', '2.25', '2.26', '2.27'],
	yData: [0, 20, 40, 60, 80, 100],
	dataArr: [75, 74.8, 74.2, 73.8, 74.5, 74.8, 99.8],
	type: 'all'  //last-最后一个，all-所有
}
this.selectComponent('#mdLineChart').beginDraw({ //开始绘图，需代码触发
	successFun: ()=> {},
	failFun: ()=> {}
})

#指标图组件
#json配置：
"usingComponents": {
	"mdIndexChart": "/components/indexChart/indexChart"
}
#wxml配置：
<mdIndexChart id='mdIndexChart' style='width: 528rpx; height: 100rpx;' canvasW='528' type='number' lowValue='4' highValue='8' value='2.5' unit='kg'></mdIndexChart> --数字类型
<mdIndexChart id='mdIndexChart' style='width: 528rpx; height: 92rpx;' canvasW='528' type='number-gray' lowValue='4' highValue='8' value='2.5' unit='kg'></mdIndexChart> --数字类型（孕期）
<mdIndexChart id='mdIndexChart' style='width: 320rpx; height: 70rpx;' canvasW='320' type='category' lowCategoryValue='不足' normalCategoryValue='正常' highCategoryValue='过量' active='low'></mdIndexChart> --种类类型
<mdIndexChart id='mdIndexChart' style='width: 320rpx; height: 70rpx;' canvasW='320' type='category-gray' normalCategoryValue='正常'></mdIndexChart> --种类类型（孕期）
#js配置：
this.selectComponent('#mdIndexChart').beginDraw({ //开始绘图，需代码触发
	successFun: ()=> {},
	failFun: ()=> {}
})

#雷达图组件
#json配置：
"usingComponents": {
	"mdRadarChart": "/components/radarChart/radarChart"
}
#wxml配置：
<mdRadarChart id='mdRadarChart' style='position:absolute;top:300rpx;left:0;right:0;margin:auto;width:590rpx;height:490rpx;' canvasW='590' canvasH='490' r='180' nameList='{{nameList}}' dataList='{{dataList}}'></mdRadarChart>
#js配置：
data: {
	nameList: ['体重', '体脂率', '骨骼肌', '心率', '基础代谢   /100'],
	dataList: [40, 20, 60, 80, 60]
}
this.selectComponent('#mdRadarChart').beginDraw({ //开始绘图，需代码触发
	successFun: ()=> {},
	failFun: ()=> {}
})

#海报图组件
#json配置：
"usingComponents": {
	"mdPoster": "/components/poster/poster"
}
#wxml配置：
<mdPoster id='mdPoster' style='width:100%;height:900rpx;' canvasW='750' canvasH='900' randarH='520' r='180' nameList='{{nameList}}' dataList='{{dataList}}' title='我的饮食雷达图' desc='合理的营养摄入是健康生活的基础。'></mdPoster>
#js配置：
data: {
	nameList: ['体重', '体脂率', '骨骼肌', '心率', '基础代谢   /100'],
	dataList: [40, 20, 60, 80, 60]
}
this.selectComponent('#mdPoster').beginDraw({ //开始绘图，需代码触发
	successFun: ()=> {},
	failFun: ()=> {}
})
this.selectComponent('#mdPoster').getImgSrc() //获取海报图路径，用于保存相册
