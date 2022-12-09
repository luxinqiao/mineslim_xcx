const md_canvas = require('../../utils/canvas.js')
const md_common = require('../../utils/common.js')

Component({
	/** 外部属性 **/
	properties: {
		canvasW: { //绘图宽度（必填）
			type: Number,
			value: 0
		},
		canvasH: { //绘图高度（必填）
			type: Number,
			value: 0
		},
		rate: { //绘图倍率
			type: Number,
			value: 1
		},
		xData: { //x轴数据（必填）
			type: Array,
			value: []
		},
		yData: { //y轴数据（必填）
			type: Array,
			value: []
		},
		dataList: { //数据（必填）
			type: Array,
			value: []
		},
		color: { //线颜色
			type: String,
			value: '#000'
		},
		markType: {  //标记类型；all-所有   last-最后一个
			type: String,
			value: 'last'
		}
	},

	/** 内部属性 **/
	data: {
		w: 0, h: 0,
		left: 55, right: 10, top: 55, bottom: 45,
		canvasImg: ''
	},

	/** 组件方法 **/
	methods: {
		/**
			开始绘图
			@param {
				{Function} successFun 成功回调
				{Function} failFun 失败回调
			}
			@return
		 */
		beginDraw({ successFun, failFun }) {
			this.initCanvas()
			this.drawX()
			this.drawY()
			this.drawData()
			md_canvas.draw(() => {
				this.saveCanvas({ successFun, failFun })
			})
		},
		/**
        	初始化canvas
        	@param
        	@return
         */
		initCanvas() {
			this.setData({
				canvasW: this.properties.canvasW * this.properties.rate,
				canvasH: this.properties.canvasH * this.properties.rate,
				w: (this.properties.canvasW - this.data.left - this.data.right) * this.properties.rate,
				h: (this.properties.canvasH - this.data.top - this.data.bottom) * this.properties.rate,
			})
			md_canvas.init({
				ctx: wx.createCanvasContext('canvas', this),
				rate: this.properties.rate,
				letterSpace: 0
			})
		},

		/**
        	绘画x轴
        	@param
        	@return
         */
		drawX() {
			let x = this.data.left
			for (let i = 0; i < this.properties.xData.length; i++) {
				//画x轴坐标
				md_canvas.drawText({
					str: this.properties.xData[i],
					pos: { x: x, y: this.data.h + this.data.top + 40 },
					line: { w: 100, h: 28 },
					font: 'normal normal ' + 20 * this.properties.rate + 'px sans-serif',
					color: '#000'
				})
				x += (this.data.w - 40) / (this.properties.xData.length - 1)
			}
		},
		/**
        	绘画y轴
        	@param
        	@return
         */
		drawY() {
			let y = this.data.top
			for (let i = this.properties.yData.length - 1; i >= 0; i--) {
				//画y轴坐标
				md_canvas.drawText({
					str: this.properties.yData[i],
					pos: { x: this.data.left - 15 - md_canvas.getTextWidth({ fontSize: 20, str: this.properties.yData[i] }), y: y + 10 },
					line: { w: 100, h: 28 },
					font: 'normal normal ' + 20 * this.properties.rate + 'px sans-serif',
					color: '#000'
				})
				//画分割线
				md_canvas.drawLine({
					start: { x: this.data.left, y: y },
					end: { x: this.data.left + this.data.w, y: y },
					line: { width: 2, color: '#d4d4d4' }
				})
				y += this.data.h / (this.properties.yData.length - 1)
			}
		},

		/**
        	绘画数据
        	@param
        	@return
         */
		drawData() {
			let dataArr = [],
			x = this.data.left + 15
			//数据重整：剔除空数据
			for (let i = 0; i < this.properties.dataList.length; i++) {
				if (!md_common.isEmpty(this.properties.dataList[i])) {
					dataArr.push({
						x: x,
						y: this.data.h + this.data.top - this.properties.dataList[i] * this.data.h / this.properties.yData[this.properties.yData.length-1],
						str: this.properties.dataList[i]
					})
				}
				x += (this.data.w - 40) / (this.properties.dataList.length - 1)
			}
			//绘制折线数据
			for (let i = 0; i < dataArr.length; i++) {
				if(this.properties.markType == 'all') {
					md_canvas.drawCircle({
						pos: { x: dataArr[i].x, y: dataArr[i].y },
						angle: { start: 0, end: 2 * Math.PI },
						r: 7,
						color: this.properties.color
					})
					md_canvas.drawText({
						str: dataArr[i].str,
						pos: { x: dataArr[i].x + 18 - md_canvas.getTextWidth({ fontSize: 30, str: dataArr[i].str }), y: dataArr[i].y - 20 },
						line: { w: 100, h: 26 },
						font: 'normal normal ' + 30 * this.properties.rate + 'px sans-serif',
						color: this.properties.color
					})
					if (i < dataArr.length - 1) {
						md_canvas.drawLine({
							start: { x: dataArr[i].x, y: dataArr[i].y },
							end: { x: dataArr[i + 1].x, y: dataArr[i + 1].y },
							line: { width: 4, color: this.properties.color }
						})
					}
				} else {
					if (i < dataArr.length - 1) {
						md_canvas.drawLine({
							start: { x: dataArr[i].x, y: dataArr[i].y },
							end: { x: dataArr[i + 1].x, y: dataArr[i + 1].y },
							line: { width: 4, color: this.properties.color }
						})
					} else {
						md_canvas.drawCircle({
							pos: { x: dataArr[i].x, y: dataArr[i].y },
							angle: { start: 0, end: 2 * Math.PI },
							r: 7,
							color: this.properties.color
						})
						md_canvas.drawText({
							str: dataArr[i].str,
							pos: { x: dataArr[i].x + 18 - md_canvas.getTextWidth({ fontSize: 30, str: dataArr[i].str }), y: dataArr[i].y - 20 },
							line: { w: 100, h: 26 },
							font: 'normal normal ' + 30 * this.properties.rate + 'px sans-serif',
							color: this.properties.color
						})
					}
				}
			}
		},

		/**
			保存canvas为图片
			@param {
				{Function} successFun 成功回调
				{Function} failFun 失败回调
			}
			@return
		 */
		saveCanvas({ successFun, failFun }) {
			wx.canvasToTempFilePath({
				canvasId: 'canvas',
				success: (res) => {
					this.setData({
						canvasImg: res.tempFilePath
					})
					typeof (successFun) == 'function' ? successFun() : ''
				},
				fail: function (res) {
					typeof (successFun) == 'function' ? failFun() : ''
				}
			}, this)
		}
	}
})