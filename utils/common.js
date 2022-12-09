/**
	文件描述：通用工具类
	创建人：卢信桥
	创建时间：2020-03-19
 */
const md_app = getApp()
/**
    去除字符串左右空格
    @param {String}str 原字符串
    @return {String} 去除左右空格后的字符串
*/
const trimStr = function (str) {
	if (str === undefined || str === 'undefined') {
		return ''
	}
	if (typeof (str) == 'number') {
		str = str.toString()
	}
	if(str instanceof Date) {
		return str
	}
	return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
}
/**
    是否为空
    @param {String}a 变量
    @return {Boolean} 是否为空
*/
const isEmpty = function (a) {
	// a = trimStr(a)
	if (a === undefined || a === 'undefined' || a === null || a === 'null' || a === '' ||
		JSON.stringify(a) === '{}' || JSON.stringify(a) === '[]') {
		return true
	}
	return false
}
/**
	日期格式化
	@param {Date}time 时间
	@param {String}format 时间格式
	@return {String} 新格式日期
*/
const dateFormat = function (time, format) {
	if (isEmpty(time)) {
		return ''
	}
	const t = new Date(time)
	const tf = function (i) {
		return (i < 10 ? '0' : '') + i
	}
	return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function (a) {
		switch (a) {
			case 'YYYY':
				return tf(t.getFullYear())
				break
			case 'MM':
				return tf(t.getMonth() + 1)
				break
			case 'DD':
				return tf(t.getDate())
				break
			case 'hh':
				return tf(t.getHours())
				break
			case 'mm':
				return tf(t.getMinutes())
				break
			case 'ss':
				return tf(t.getSeconds())
				break
		}
	})
}

/**
	图片压缩
	@param {Number}width 宽
    @param {Number}height 高
	@return {String} 压缩链接
*/
const compressImg = (width, height) => {
	return '?x-oss-process=image/auto-orient,0/resize,m_lfit,h_' + height + ',w_' + width
}

/**
	获取上一页
	@param
	@return {Object} 上一页
*/
const getPrePage = () => {
	const pages = getCurrentPages()
	return pages[pages.length - 2]
}
/**
	刷新上一页
	@param
	@return
*/
const refreshPrePage = () => {
	const prePage = getPrePage()
	prePage.onLoad(prePage.options)
}
/**
	获取当前页
	@param
	@return {Object} 当前页
*/
const getCurrPage = () => {
	const pages = getCurrentPages()
	return pages[pages.length - 1]
}

/**
	数组去重
	@param {Array} param 原参数
	@return {String} 新参数
*/
const uniqueArr = (arr, key) => {
	let newArr = []
	for (let i = 0; i < arr.length; i++) {
		if (!isInArr(newArr, key, arr[i][key])) {
			newArr.push(arr[i])
		}
	}
	return newArr
}
/**
	数组是否包含元素
	@param {Array} arr 原参数
    @param {String} key 键
    @param {String} value 值
	@return {String} 是否包含
*/
const isInArr = (arr, key, value) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][key] == value) {
			return true
		}
	}
	return false
}
/**
	按钮点击限制(全局变量形式)
	@param {Fun} callback 回调函数
	@return
*/
const btnlimit_var = function (callback) {
	if (md_app.globalData.isHasClick) {
		return
	}
	md_app.globalData.isHasClick = true
	callback()
}
/**
	解除按钮点击限制
	@param
	@return
*/
const removebtnlimit = function () {
	md_app.globalData.isHasClick = false
}

//模块化导出
module.exports = {
	trimStr: trimStr,
	isEmpty: isEmpty,
	dateFormat: dateFormat,
	compressImg: compressImg,
	getPrePage: getPrePage,
	refreshPrePage: refreshPrePage,
	getCurrPage: getCurrPage,
	uniqueArr: uniqueArr,
	isInArr: isInArr,
	btnlimit_var: btnlimit_var,
	removebtnlimit: removebtnlimit
}