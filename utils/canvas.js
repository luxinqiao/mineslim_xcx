/**
	文件描述：绘图工具类
	创建人：卢信桥
	创建时间：2020-04-07
 */

let dataObj = {
	ctx: '',
	rate: 1,
	letterSpace: 0
}

/**
	初始化
	@param {Object} {
        {String} ctx 绘图对象
        {Number} rate 倍率
        {Number} letterSpace 字间距
    }
	@return
 */
const init = ({ ctx, rate, letterSpace }) => {
	dataObj.ctx = ctx
	dataObj.rate = rate
	dataObj.letterSpace = letterSpace
}

/**
	清除绘图
	@param {
        {Number} x x轴
        {Number} y y轴
        {Number} width 绘图区域宽度
        {Number} height 绘图区域高度
    }
	@return 
 */
const clearDraw = ({ x, y, width, height})=> {
	dataObj.ctx.clearRect(x,y,width, height)
	dataObj.ctx.draw()
}

/**
	获取内容高度（文本）
	@param {
        {String} fontSize 字体大小
        {Object} line 行
        {String} str 文本
    }
	@return {Number} 高度
 */
const getTextHeight = ({ fontSize, line, str }) => {
	if (typeof (str) == 'number') {
		str = str.toString()
	}
	dataObj.ctx.setFontSize(fontSize)
	let w = 0, totalHeight = line.h
	for (let i = 0; i < str.length; i++) {
		const letterW = dataObj.ctx.measureText(str[i]).width + dataObj.letterSpace
		w += letterW
		if (w > line.w) {
			w = letterW
			totalHeight += line.h
		}
	}
	return totalHeight
}

/**
	获取内容宽度（文本）
	@param {
        {String} fontSize 字体大小
        {String} str 文本
    }
	@return {Number} 宽度
 */
const getTextWidth = ({ fontSize, str }) => {
	if (typeof (str) == 'number') {
		str = str.toString()
	}
	dataObj.ctx.setFontSize(fontSize)
	return dataObj.ctx.measureText(str).width + str.length * dataObj.letterSpace
}

/**
	绘图文本
	@param {
        {String} font 字体
        {Object} line 行
		{Object} pos 位置
		{String} str 字
		{String} color 颜色
    }
	@param {Function} callback 回调函数
	@return
 */
const drawText = ({ font, line, pos, str, color }, callback) => {
	if (typeof (str) == 'number') {
		str = str.toString()
	}
	dataObj.ctx.font = font
	dataObj.ctx.setFillStyle(color)
	let w = 0, totalHeight = line.h
	for (let i = 0; i < str.length; i++) {
		const letterW = dataObj.ctx.measureText(str[i]).width + dataObj.letterSpace
		w += letterW
		if (w > line.w * dataObj.rate) { //宽度超出：换行
			w = letterW
			totalHeight += line.h
			pos.y += line.h
			dataObj.ctx.fillText(str[i], pos.x * dataObj.rate, pos.y * dataObj.rate)
		} else {
			dataObj.ctx.fillText(str[i], pos.x * dataObj.rate + (w - letterW), pos.y * dataObj.rate)
		}
	}
	typeof (callback) == 'function' ? callback(totalHeight) : ''
}

/**
	绘图图片
	@param {
		{String} imgUrl 图片链接
		{Object} pos 位置
		{Object} size 尺寸
	}
	@return
 */
const drawImage = ({ imgUrl, pos, size}) => {
	dataObj.ctx.drawImage(imgUrl, pos.x * dataObj.rate, pos.y * dataObj.rate, size.w * dataObj.rate, size.h * dataObj.rate)
}

/**
	绘图直线
	@param {
		{Object} line 行
		{Object} start 开始
		{Object} end 结束
	}
	@return
 */
const drawLine = ({ line, start, end}) => {
	dataObj.ctx.lineWidth = line.width
	dataObj.ctx.setLineDash(0)
	dataObj.ctx.strokeStyle = line.color
	dataObj.ctx.beginPath()
	dataObj.ctx.moveTo(start.x, start.y)
	dataObj.ctx.lineTo(end.x, end.y)
	dataObj.ctx.stroke()
	dataObj.ctx.closePath()
}

/**
	绘图虚线
	@param {
		{Object} line 行
		{Object} start 开始
		{Object} end 结束
		{Object} dash 虚线
	}
	@return
 */
const drawDash = ({ line, start, end, dash }) => {
	dataObj.ctx.lineWidth = line.width
	dataObj.ctx.setLineDash(dash.length, dash.pos)
	dataObj.ctx.strokeStyle = line.color
	dataObj.ctx.beginPath()
	dataObj.ctx.moveTo(start.x, start.y)
	dataObj.ctx.lineTo(end.x, end.y)
	dataObj.ctx.stroke()
	dataObj.ctx.closePath()
}

/**
	绘图二维码
	@param {
		{Object} pos 位置
		{Object} size 尺寸
		{String} imgUrl 图片链接
		{String} borderColor 边框颜色
	}
	@return
 */
const drawQrcode = ({ pos, size, imgUrl, borderColor }) => {
	//二维码裁剪成圆图
	dataObj.ctx.beginPath()
	dataObj.ctx.arc((pos.x + size.r) * dataObj.rate, (pos.y + size.r) * dataObj.rate, size.r, 0, Math.PI * 2, false)
	dataObj.ctx.clip()
	dataObj.ctx.drawImage(imgUrl, (pos.x + 10) * dataObj.rate, (pos.y + 10) * dataObj.rate, size.w * dataObj.rate, size.h * dataObj.rate)
	//圆形边框
	dataObj.ctx.arc((pos.x + size.r) * dataObj.rate, (pos.y + size.r) * dataObj.rate, size.r, 0, Math.PI * 2, false)
	dataObj.ctx.lineWidth = 2
	dataObj.ctx.strokeStyle = borderColor
	dataObj.ctx.stroke()
	dataObj.ctx.closePath()
}

/**
	绘图矩形
	@param {
		{String} color 颜色
		{Object} pos 位置
		{Object} size 尺寸
	}
	@return
 */
const drawRect = ({ color, pos, size }) => {
	dataObj.ctx.setFillStyle(color)
	dataObj.ctx.fillRect(pos.x, pos.y, size.w, size.h)
}

/**
	绘图圆弧
	@param {
		{Object} pos 位置
		{Object} angle 弧度
		{Number} r 半径
		{String} color 颜色
	}
	@return
 */
const drawCircle = ({pos, angle, r, color}) => {
	dataObj.ctx.beginPath()
	dataObj.ctx.arc(pos.x, pos.y, r, angle.start, angle.end)
	dataObj.ctx.setFillStyle(color)
	dataObj.ctx.fill()
	dataObj.ctx.closePath()
}

/**
	绘图向上箭头
	@param {
		{Object} pos 位置
		{Object} size 尺寸
		{Number} bold 线粗
		{String} color 颜色
	}
	@return
 */
const drawArrowTop = ({ pos, size, bold, color }) => {
	drawLine({
		start: { x: pos.x, y: pos.y },
		end: { x: pos.x, y: pos.y + size.h },
		line: { width: bold + 1, color: color }
	})
	drawLine({
		start: { x: pos.x, y: pos.y },
		end: { x: pos.x - size.w / 2, y: pos.y + size.h / 2 },
		line: { width: bold, color: color }
	})
	drawLine({
		start: { x: pos.x, y: pos.y },
		end: { x: pos.x + size.w / 2, y: pos.y + size.h / 2 },
		line: { width: bold, color: color }
	})
}
/**
	绘图向下箭头
	@param {
		{Object} pos 位置
		{Object} size 尺寸
		{Number} bold 线粗
		{String} color 颜色
	}
	@return
 */
const drawArrowBottom = ({ pos, size, bold, color }) => {
	drawLine({
		start: { x: pos.x, y: pos.y },
		end: { x: pos.x, y: pos.y + size.h },
		line: { width: bold + 1, color: color }
	})
	drawLine({
		start: { x: pos.x - size.w / 2, y: pos.y + size.h / 2 },
		end: { x: pos.x, y: pos.y + size.h },
		line: { width: bold, color: color }
	})
	drawLine({
		start: { x: pos.x + size.w / 2, y: pos.y + size.h / 2 },
		end: { x: pos.x, y: pos.y + size.h },
		line: { width: bold, color: color }
	})
}

/**
	绘图
	@param {function} callback 回调函数
	@return
 */
const draw = (callback) => {
	dataObj.ctx.draw(true, () => {
		setTimeout(() => {
			callback()
		}, 500)
	})
}
/**
	移动
	@param {
		{Object} pos 位置
	}
	@return
 */
const translate = ( { pos } ) => {
	dataObj.ctx.translate(pos.x, pos.y)
}

/**
	画多边形
	@param {
		{number} n 边数
		{number} r 半径
		{number} width 线宽
		{string} color 颜色
	}
	@return
 */
const drawPolygon = ({ n, r, width, color }) => {
	const angle = Math.PI * 2 / n
	for (let i = 0; i < n; i++) {
		drawLine({
			start: { x: Math.sin(angle * i) * r, y: -Math.cos(angle * i) * r },
			end: { x: Math.sin(angle * (i + 1)) * r, y: -Math.cos(angle * (i + 1)) * r },
			line: { width: width, color: color }
		})
	}
}

/**
	填充多边形
	@param {
		{number} max 最大值
		{array} dataList 数据
		{number} r 半径
		{number} width 线宽
		{string} color 线颜色
		{string} fillColor 填充颜色
		{boolean} isPoint 是否圆点
	}
	@return
 */
const fillPolygon = ({ max, dataList, r, width, color, fillColor, isPoint }) => {
	//画填充
	dataObj.ctx.lineWidth = width
	dataObj.ctx.strokeStyle = color
	dataObj.ctx.setLineDash(0)
	dataObj.ctx.beginPath()
	const angle = Math.PI * 2 / dataList.length
	for (let i = 0; i < dataList.length; i++) {
		let startX = Math.sin(angle * i) * r * dataList[i] / max,
		startY = -Math.cos(angle * i) * r * dataList[i] / max,
		endX = Math.sin(angle * (i + 1)) * r * dataList[i + 1] / max,
		endY = -Math.cos(angle * (i + 1)) * r * dataList[i + 1] / max
		if (i == 0) {
			dataObj.ctx.moveTo(startX, startY)
		}
		if (i == dataList.length -1) {
			endX = Math.sin(angle * 0) * r * dataList[0] / max
			endY = -Math.cos(angle * 0) * r * dataList[0] / max
		}
		dataObj.ctx.lineTo(endX, endY)
	}
	dataObj.ctx.closePath()
	dataObj.ctx.setFillStyle(fillColor)
	dataObj.ctx.fill()
	dataObj.ctx.stroke()
	//画圆点
	if (isPoint) {
		for (let i = 0; i < dataList.length; i++) {
			drawCircle({
				pos: { x: Math.sin(angle * i) * r * dataList[i] / max, y: -Math.cos(angle * i) * r * dataList[i] / max },
				angle: { start: 0, end: 2 * Math.PI },
				r: 4,
				color: color
			})
		}
	}
}

module.exports = {
	init: init,
	clearDraw: clearDraw,
	getTextHeight: getTextHeight,
	getTextWidth: getTextWidth,
	drawText: drawText,
	drawImage: drawImage,
	drawRect: drawRect,
	drawCircle: drawCircle,
	drawQrcode: drawQrcode,
	drawLine: drawLine,
	drawDash: drawDash,
	drawArrowTop: drawArrowTop,
	drawArrowBottom: drawArrowBottom,
	draw: draw,
	translate: translate,
	drawPolygon: drawPolygon,
	fillPolygon: fillPolygon
}