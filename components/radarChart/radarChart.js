const md_canvas = require('../../utils/canvas.js')

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
		r: { //半径（必填）
			type: Number,
			value: 0
		},
		rate: { //倍率
			type: Number,
			value: 1
		},
		nameList: { //名称集（必填）
			type: Array,
			value: []
		},
		dataList: { //数据集（必填）
			type: Array,
			value: []
		},
		sectionNum: { //区间数
			type: Number,
			value: 5
		},
		lineW: { //线宽
			type: Number,
			value: 1
		},
		lineColor: { //线颜色
			type: String,
			value: '#999'
		},
		markColor: { //尺标颜色
			type: String,
			value: '#333'
		},
		fillLineW: { //填充线宽
			type: Number,
			value: 2
		},
		fillLineColor: { //填充线颜色
			type: String,
			value: '#5A5AD1'
		},
		fillColor: { //填充颜色
			type: String,
			value: 'rgba(90,90,209,0.2)'
		}
	},

	/** 内部属性 **/
	data: {
		edgeNum: 0, //边数
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
			this.setData({
				edgeNum: this.properties.nameList.length
			})
			this.initCanvas()
			this.drawCanvas()
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
				canvasH: this.properties.canvasH * this.properties.rate
			})
			md_canvas.init({
				ctx: wx.createCanvasContext('canvas', this),
				rate: this.properties.rate,
				letterSpace: 0
			})
			md_canvas.translate({
				pos: { x: this.data.canvasW / 2, y: this.data.canvasH / 2 }
			})
		},

		/**
        	绘画canvas
        	@param
        	@return
         */
		drawCanvas() {
			const max = this.getMax()
			//画基准线
			for (let i = 1; i <= this.properties.sectionNum; i++) {
				md_canvas.drawPolygon({
					n: this.data.edgeNum,
					r: this.properties.r / this.properties.sectionNum * i,
					width: this.properties.lineW,
					color: this.properties.lineColor
				})
			}
			//画基准尺标
			const newR = Math.cos(Math.PI / this.data.edgeNum) * this.properties.r
			for (let i = 0; i <= this.properties.sectionNum; i++) {
				let x = Math.sin(Math.PI / this.properties.sectionNum) * newR / this.properties.sectionNum * i,
					y = -Math.cos(Math.PI / this.properties.sectionNum) * newR / this.properties.sectionNum * i
				if (i == 0) {
					md_canvas.drawText({
						str: max / this.properties.sectionNum * i,
						pos: { x: -4, y: 4 },
						line: { w: 100, h: 22 },
						font: 'normal normal ' + 16 * this.properties.rate + 'px sans-serif',
						color: this.properties.markColor
					})
					continue
				}
				md_canvas.drawText({
					str: max / this.properties.sectionNum * i,
					pos: { x: x - 8, y: y + 8 },
					line: { w: 100, h: 22 },
					font: 'normal normal ' + 16 * this.properties.rate + 'px sans-serif',
					color: this.properties.markColor
				})
			}
			//画数据填充
			md_canvas.fillPolygon({
				max: max,
				dataList: this.properties.dataList,
				r: this.properties.r,
				width: this.properties.fillLineW,
				color: this.properties.fillLineColor,
				fillColor: this.properties.fillColor
			})
			//画文案
			for (let i = 0; i < this.data.edgeNum; i++) {
				let w = md_canvas.getTextWidth({ fontSize: 24, str: this.properties.nameList[i] })
				if (w > 120) {
					w = 120
				}
				let h = md_canvas.getTextHeight({ fontSize: 24, line: { w: 120, h: 34 }, str: this.properties.nameList[i] })
				let x = Math.sin(Math.PI * 2 / this.data.edgeNum * i) * (this.properties.r + w * 0.7),
					y = -Math.cos(Math.PI * 2 / this.data.edgeNum * i) * (this.properties.r + h * 0.7)
				md_canvas.drawText({
					str: this.properties.nameList[i],
					pos: {
						x: x - w / 2,
						y: y + h / 3
					},
					line: { w: 120, h: 34 },
					font: 'normal normal ' + 24 * this.properties.rate + 'px sans-serif',
					color: this.properties.markColor
				})
			}
		},
		
		/**
        	获取最大尺标
        	@param
        	@return {number} 最大尺标
         */
		getMax() {
			let max = 0
			for (let i = 0; i < this.properties.dataList.length; i++) {
				if (this.properties.dataList[i] < 100) {
					max = 100
				} else if (max < this.properties.dataList[i]) {
					max = this.properties.dataList[i]
				}
			}
			if (max > 100 && max % this.properties.sectionNum > 0) {
				max = Math.ceil(max / this.properties.sectionNum) * this.properties.sectionNum
			}
			return max
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