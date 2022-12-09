const md_canvas = require('../../utils/canvas.js')

Component({
	/** 外部属性 **/
	properties: {
		canvasW: { //绘图宽度（必填）
			type: Number,
			value: 0
		},
		type: { //类型：category-种类，category-gray-种类（孕期），number-数值，number-gray-数值（孕期）（必填）
			type: String,
			value: ''
		},
		bgLineColor: { //背景色
			type: String,
			value: '#dcdddd'
		},
		lowValue: { //低值（必填）--type=number时配置
			type: Number,
			value: 0
		},
		lowValueColor: { //低值颜色 --type=number时配置
			type: String,
			value: '#999'
		},
		lowLineColor: { //低值线条颜色 --type=number时配置
			type: String,
			value: '#999'
		},
		lowMarkColor: { //低值标记颜色 --type=number时配置
			type: String,
			value: '#666'
		},
		lowCategoryValue: { //低值（必填）--type=category时配置
			type: String,
			value: ''
		},
		lowCategoryValueColor: { //低值颜色 --type=category时配置
			type: String,
			value: '#999'
		},
		lowCategoryValueActiveColor: { //低值激活颜色 --type=category时配置
			type: String,
			value: '#999'
		},
		lowCategoryLineActiveColor: { //低值线条激活颜色 --type=category时配置
			type: String,
			value: '#999'
		},
		normalValue: { //正常值 --type=number时配置
			type: String,
			value: '正常'
		},
		normalValueColor: { //正常值颜色 --type=number时配置
			type: String,
			value: '#999'
		},
		normalLineColor: { //正常值线条颜色 --type=number时配置
			type: String,
			value: '#8585e5'
		},
		normalMarkColor: { //正常值标记颜色 --type=number时配置
			type: String,
			value: '#5a5ad1'
		},
		normalCategoryValue: { //正常值（必填）--type=category时配置
			type: String,
			value: ''
		},
		normalCategoryValueColor: { //正常值颜色 --type=category时配置
			type: String,
			value: '#999'
		},
		normalCategoryValueActiveColor: { //正常值激活颜色 --type=category时配置
			type: String,
			value: '#5a5ad1'
		},
		normalCategoryLineActiveColor: { //正常值线条激活颜色 --type=category时配置
			type: String,
			value: '#8585e5'
		},
		highValue: { //高值（必填） --type=number时配置
			type: Number,
			value: 0
		},
		highValueColor: { //高值颜色 --type=number时配置
			type: String,
			value: '#999'
		},
		highLineColor: { //高值线条颜色 --type=number时配置
			type: String,
			value: '#ea7376'
		},
		highMarkColor: { //高值标记颜色 --type=number时配置
			type: String,
			value: '#d81c20'
		},
		highCategoryValue: { //高值（必填）--type=category时配置
			type: String,
			value: ''
		},
		highCategoryValueColor: { //高值颜色 --type=category时配置
			type: String,
			value: '#999'
		},
		highCategoryValueActiveColor: { //高值激活颜色 --type=category时配置
			type: String,
			value: '#ea7376'
		},
		highCategoryLineActiveColor: { //高值线条激活颜色 --type=category时配置
			type: String,
			value: '#ea7376'
		},
		value: { //实际值（必填） --type=number时配置
			type: Number,
			value: 0
		},
		unit: { //单位（必填） --type=number时配置
			type: String,
			value: ''
		},
		active: { //激活项：low/normal/high（必填） --type=category时配置
			type: String,
			value: ''
		}
	},

	/** 内部属性 **/
	data: {
		canvasH: 100,
		top: 58,
		lineW: 4,
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
			if (this.properties.type == 'number') {
				this.drawNumberCanvas()
			} else if (this.properties.type == 'number-gray') {
				this.drawNumberGrayCanvas()
			} else if (this.properties.type == 'category') {
				this.drawCategoryCanvas()
			} else if (this.properties.type == 'category-gray') {
				this.drawCategoryGrayCanvas()
			}
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
				canvasH: this.properties.type == 'category' ? 70 : 100
			})
			md_canvas.init({
				ctx: wx.createCanvasContext('canvas', this),
				rate: 1,
				letterSpace: 0
			})
		},

		/**
        	绘画canvas（type=number）
        	@param
        	@return
         */
		drawNumberCanvas() {
			this.drawLow()
			this.drawNormal()
			this.drawHigh()
			this.drawValue()
		},

		/**
        	绘画低值（type=number）
        	@param
        	@return
         */
		drawLow() {
			md_canvas.drawLine({
				start: { x: 0, y: this.data.top },
				end: { x: this.properties.canvasW * 0.2, y: this.data.top },
				line: { width: this.data.lineW, color: this.properties.value < this.properties.lowValue ? this.properties.lowLineColor : this.properties.bgLineColor }
			})
			md_canvas.drawText({
				str: this.properties.lowValue,
				pos: { x: this.properties.canvasW * 0.2 - md_canvas.getTextWidth({ fontSize: 20, str: this.properties.lowValue }) / 2, y: this.data.top + 35 },
				line: { w: 100, h: 28 },
				font: 'normal normal 20px sans-serif',
				color: this.properties.lowValueColor
			})
		},
		/**
        	绘画正常值（type=number）
        	@param
        	@return
         */
		drawNormal() {
			md_canvas.drawLine({
				start: { x: this.properties.canvasW * 0.2, y: this.data.top },
				end: { x: this.properties.canvasW * 0.8, y: this.data.top },
				line: { width: this.data.lineW, color: this.properties.normalLineColor }
			})
			md_canvas.drawText({
				str: this.properties.normalValue,
				pos: { x: this.properties.canvasW * 0.5 - md_canvas.getTextWidth({ fontSize: 20, str: this.properties.normalValue }) / 2, y: this.data.top + 35 },
				line: { w: 100, h: 28 },
				font: 'normal normal 20px sans-serif',
				color: this.properties.normalValueColor
			})
		},
		/**
        	绘画高值（type=number）
        	@param
        	@return
         */
		drawHigh() {
			md_canvas.drawLine({
				start: { x: this.properties.canvasW * 0.8, y: this.data.top },
				end: { x: this.properties.canvasW, y: this.data.top },
				line: { width: this.data.lineW, color: this.properties.value > this.properties.highValue ? this.properties.highLineColor : this.properties.bgLineColor }
			})
			md_canvas.drawText({
				str: this.properties.highValue,
				pos: { x: this.properties.canvasW * 0.8 - md_canvas.getTextWidth({ fontSize: 20, str: this.properties.highValue }) / 2, y: this.data.top + 35 },
				line: { w: 100, h: 28 },
				font: 'normal normal 20px sans-serif',
				color: this.properties.highValueColor
			})
		},
		/**
        	绘画实际值（type=number）
        	@param
        	@return
         */
		drawValue() {
			let markColor = this.properties.normalMarkColor, markWidth = md_canvas.getTextWidth({ fontSize: 24, str: this.properties.value + this.properties.unit }), arrowType = ''
			if (this.properties.value < this.properties.lowValue) {
				markColor = this.properties.lowMarkColor
				markWidth += 16
				arrowType = 'bottom'
			} else if (this.properties.value > this.properties.highValue) {
				markColor = this.properties.highMarkColor
				markWidth += 16
				arrowType = 'top'
			}
			let valueX = this.properties.canvasW * ((this.properties.value - this.properties.lowValue) / (this.properties.highValue - this.properties.lowValue) * 0.6 + 0.2)
			let markX = valueX - markWidth / 2
			if (valueX < 9) {
				valueX = 9
			} else if (valueX > this.properties.canvasW - 9) {
				valueX = this.properties.canvasW - 9
			}
			if (markX < 0) {
				markX = 0
			} else if (markX > this.properties.canvasW - markWidth - 8 ) {
				markX = this.properties.canvasW - markWidth - 8
			}
			//圆圈
			md_canvas.drawCircle({
				pos: { x: valueX, y: this.data.top },
				angle: { start: 0, end: 2 * Math.PI },
				r: 9,
				color: markColor
			})
			md_canvas.drawCircle({
				pos: { x: valueX, y: this.data.top },
				angle: { start: 0, end: 2 * Math.PI },
				r: 6,
				color: '#fff'
			})
			//上下箭头
			if (arrowType == 'top') {
				md_canvas.drawArrowTop({
					pos: { x: markX + 6, y: 13 },
					size: { w: 12, h: 12 },
					bold: 2,
					color: markColor
				})
				markX += 16
			} else if (arrowType == 'bottom') {
				md_canvas.drawArrowBottom({
					pos: { x: markX + 6, y: 13 },
					size: { w: 12, h: 12 },
					bold: 2,
					color: markColor
				})
				markX += 16
			}
			//标记值
			md_canvas.drawText({
				str: this.properties.value + this.properties.unit,
				pos: { x: markX, y: 28 },
				line: { w: 100, h: 34 },
				font: 'normal bold 24px sans-serif',
				color: markColor
			})
		},
		
		/**
        	绘画canvas（type=number-gray）
        	@param
        	@return
         */
		drawNumberGrayCanvas() {
			//1.画线
			md_canvas.drawLine({
				start: { x: 0, y: this.data.top },
				end: { x: this.properties.canvasW, y: this.data.top },
				line: { width: this.data.lineW, color: this.properties.bgLineColor }
			})
			//2.画标记
			const markWidth = md_canvas.getTextWidth({ fontSize: 24, str: this.properties.value + this.properties.unit })
			let valueX = this.properties.canvasW * ((this.properties.value - this.properties.lowValue) / (this.properties.highValue - this.properties.lowValue) * 0.6 + 0.2)
			let markX = valueX - markWidth / 2
			if (valueX < 9) {
				valueX = 9
			} else if (valueX > this.properties.canvasW - 9) {
				valueX = this.properties.canvasW - 9
			}
			if (markX < 0) {
				markX = 0
			} else if (markX > this.properties.canvasW - markWidth - 8) {
				markX = this.properties.canvasW - markWidth - 8
			}
			//圆圈
			md_canvas.drawCircle({
				pos: { x: valueX, y: this.data.top },
				angle: { start: 0, end: 2 * Math.PI },
				r: 9,
				color: this.properties.normalMarkColor
			})
			md_canvas.drawCircle({
				pos: { x: valueX, y: this.data.top },
				angle: { start: 0, end: 2 * Math.PI },
				r: 6,
				color: '#fff'
			})
			//标记值
			md_canvas.drawText({
				str: this.properties.value + this.properties.unit,
				pos: { x: markX, y: 28 },
				line: { w: 100, h: 34 },
				font: 'normal bold 24px sans-serif',
				color: this.properties.normalMarkColor
			})
		},
		
		/**
        	绘画canvas（type=category）
        	@param
        	@return
         */
		drawCategoryCanvas() {
			if (this.properties.active == 'low') {
				this.drawCategoryNormalCanvas(15, false)
				this.drawCategoryHighCanvas(15, false)
				this.drawCategoryLowCanvas(15, true)
			} else if (this.properties.active == 'normal') {
				this.drawCategoryLowCanvas(15, false)
				this.drawCategoryHighCanvas(15, false)
				this.drawCategoryNormalCanvas(15, true)
			} else if (this.properties.active == 'high') {
				this.drawCategoryLowCanvas(15, false)
				this.drawCategoryNormalCanvas(15, false)
				this.drawCategoryHighCanvas(15, true)
			}
		},

		/**
        	绘画低值（type=category）
        	@param {number} top 距顶部距离
			@param {boolean} isActive 是否激活
        	@return
         */
		drawCategoryLowCanvas(top, isActive) {
			md_canvas.drawLine({
				start: { x: 0, y: top },
				end: { x: this.properties.canvasW * 0.2, y: top },
				line: { width: this.data.lineW, color: isActive ? this.properties.lowCategoryLineActiveColor : this.properties.bgLineColor }
			})
			md_canvas.drawText({
				str: this.properties.lowCategoryValue,
				pos: { x: this.properties.canvasW * 0.1 - md_canvas.getTextWidth({ fontSize: 20, str: this.properties.lowCategoryValue }) / 2, y: top + 35 },
				line: { w: 100, h: 28 },
				font: isActive ? 'normal bold 20px sans-serif' : 'normal normal 20px sans-serif',
				color: isActive ? this.properties.lowCategoryValueActiveColor : this.properties.lowCategoryValueColor
			})
		},
		/**
        	绘画正常值（type=category）
        	@param {number} top 距顶部距离
			@param {boolean} isActive 是否激活
        	@return
         */
		drawCategoryNormalCanvas(top, isActive) {
			md_canvas.drawLine({
				start: { x: this.properties.canvasW * 0.2, y: top },
				end: { x: this.properties.canvasW * 0.8, y: top },
				line: { width: this.data.lineW, color: isActive ? this.properties.normalCategoryLineActiveColor : this.properties.bgLineColor }
			})
			md_canvas.drawText({
				str: this.properties.normalCategoryValue,
				pos: { x: this.properties.canvasW * 0.5 - md_canvas.getTextWidth({ fontSize: 20, str: this.properties.normalCategoryValue }) / 2, y: top + 35 },
				line: { w: 100, h: 28 },
				font: isActive ? 'normal bold 20px sans-serif' : 'normal normal 20px sans-serif',
				color: isActive ? this.properties.normalCategoryValueActiveColor : this.properties.normalCategoryValueColor
			})
		},
		/**
        	绘画高值（type=category）
        	@param {number} top 距顶部距离
			@param {boolean} isActive 是否激活
        	@return
         */
		drawCategoryHighCanvas(top, isActive) {
			md_canvas.drawLine({
				start: { x: this.properties.canvasW * 0.8, y: top },
				end: { x: this.properties.canvasW, y: top },
				line: { width: this.data.lineW, color: isActive ? this.properties.highCategoryLineActiveColor : this.properties.bgLineColor }
			})
			md_canvas.drawText({
				str: this.properties.highCategoryValue,
				pos: { x: this.properties.canvasW * 0.9 - md_canvas.getTextWidth({ fontSize: 20, str: this.properties.highCategoryValue }) / 2, y: top + 35 },
				line: { w: 100, h: 28 },
				font: isActive ? 'normal bold 20px sans-serif' : 'normal normal 20px sans-serif',
				color: isActive ? this.properties.highCategoryValueActiveColor : this.properties.highCategoryValueColor
			})
		},

		/**
        	绘画canvas（type=category-gray）
        	@param
        	@return
         */
		drawCategoryGrayCanvas() {
			//1.画线
			const top = 15
			md_canvas.drawLine({
				start: { x: 0, y: top },
				end: { x: this.properties.canvasW, y: top },
				line: { width: this.data.lineW, color: this.properties.bgLineColor }
			})
			//2.画标记
			md_canvas.drawText({
				str: this.properties.normalCategoryValue,
				pos: { x: this.properties.canvasW * 0.5 - md_canvas.getTextWidth({ fontSize: 20, str: this.properties.normalCategoryValue }) / 2, y: top + 35 },
				line: { w: 100, h: 28 },
				font: 'normal bold 20px sans-serif',
				color: this.properties.normalCategoryValueActiveColor
			})
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