/**
    文件描述：字典工具类
    创建人：卢信桥
    创建时间：2020-04-07
 */

/** 发现类型 **/
var findType = {
	FOOD: '1', //营养知多少
	SPORT: '2' //运动知多少
}
var getFindType = function (val) {
	if (val == findType.FOOD) {
		return '营养知多少'
	} else if (val == findType.SPORT) {
		return '运动知多少'
	}
	return val
}

/** 历史记录时间段 **/
var timeType = {
	WEEK: 1, //近一周
	MONTH: 2, //近一个月
	SEASON: 3 //近三个月
}

module.exports = {
	findType: findType,
	getFindType: getFindType,
	timeType: timeType
}