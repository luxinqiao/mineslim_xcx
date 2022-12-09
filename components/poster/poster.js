const md_canvas = require('../../utils/canvas.js')

Component({
	/** 外部属性 **/
	properties: {
		title: { //标题（必填）
			type: String,
			value: ''
		},
		desc: { //描述（必填）
			type: String,
			value: ''
		},
		qrcode: { //二维码（必填）
			type: String,
			value: ''
		},
		canvasW: { //绘图宽度（必填）
			type: Number,
			value: 0
		},
		canvasH: { //绘图高度（必填）
			type: Number,
			value: 0
		},
		randarH: { //雷达图高度（必填）
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
		sectionFillColor: { //区间填充颜色
			type: Object,
			value: {
				r: 211,
				g: 211,
				b: 211
			}
		},
		lineW: { //线宽
			type: Number,
			value: 1
		},
		lineColor: { //线颜色
			type: String,
			value: '#d3d3d3'
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
			this.drawHead()
			this.drawRandar()
			this.drawBottom()
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
			//设置canvas宽高
			this.setData({
				canvasW: this.properties.canvasW * this.properties.rate,
				canvasH: this.properties.canvasH * this.properties.rate
			})
			//canvas工具类初始化
			md_canvas.init({
				ctx: wx.createCanvasContext('canvas', this),
				rate: this.properties.rate,
				letterSpace: 0
			})
			//绘画背景白色
			md_canvas.drawRect({
				color: '#fff',
				pos: { x: 0, y: 0 },
				size: { w: this.properties.canvasW, h: this.properties.canvasH }
			})
		},

		/**
        	绘画头部
        	@param
        	@return
         */
		drawHead() {
			md_canvas.drawImage({
				imgUrl: '/images/components/radar/titleBg.png',
				pos: { x: 0, y: 0 },
				size: { w: 750, h: 150 }
			})
			md_canvas.drawText({
				str: this.properties.title,
				pos: { x: (this.data.canvasW - md_canvas.getTextWidth({ fontSize: 36, str: this.properties.title })) / 2, y: 100 },
				line: { w: 700, h: 50 },
				font: 'normal normal ' + 36 * this.properties.rate + 'px sans-serif',
				color: '#fff'
			})
		},
		
		/**
        	绘画雷达图
        	@param
        	@return
         */
		drawRandar() {
			//重置(0,0)点
			md_canvas.translate({
				pos: { x: this.data.canvasW / 2, y: 150 + this.data.randarH / 2 }
			})
			const max = this.getMax()
			//画基准线
			for (let i = this.properties.sectionNum; i >= 1; i--) {
				let arr = [], fillOpacity = (this.properties.sectionNum - i + 1) / this.properties.sectionNum / 3
				for (let j = this.data.edgeNum; j >= 1; j--) {
					arr.push(i / this.properties.sectionNum * max)
				}
				if (i == 1) {
					fillOpacity = 0.6
				}
				md_canvas.fillPolygon({
					max: max,
					dataList: arr,
					r: this.properties.r,
					width: this.properties.lineW,
					color: this.properties.lineColor,
					fillColor: 'rgba(' + this.properties.sectionFillColor.r + ',' + this.properties.sectionFillColor.g + ',' + this.properties.sectionFillColor.b + ',' + fillOpacity + ')',
					isPoint: false
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
				fillColor: this.properties.fillColor,
				isPoint: true
			})
			//画文案
			for (let i = 0; i < this.data.edgeNum; i++) {
				const str = this.properties.nameList[i]
				let maxW = 120
				if (str.substr(4, 1) == '/') {
					maxW = 96
				}
				let w = md_canvas.getTextWidth({ fontSize: 24, str: str })
				if (w > maxW) {
					w = maxW
				}
				let h = md_canvas.getTextHeight({ fontSize: 24, line: { w: maxW, h: 34 }, str: str })
				let x = Math.sin(Math.PI * 2 / this.data.edgeNum * i) * (this.properties.r + w * 0.7),
					y = -Math.cos(Math.PI * 2 / this.data.edgeNum * i) * (this.properties.r + h * 0.7)
				md_canvas.drawText({
					str: str,
					pos: {
						x: x - w / 2,
						y: y + h / 3
					},
					line: { w: maxW, h: 34 },
					font: 'normal normal ' + 24 * this.properties.rate + 'px sans-serif',
					color: this.properties.markColor
				})
			}
		},

		/**
        	绘画头部
        	@param
        	@return
         */
		drawBottom() {
			//重置(0,0)点
			md_canvas.translate({
				pos: { x: -this.data.canvasW / 2, y: this.data.randarH / 2 }
			})
			//绘描述
			md_canvas.drawText({
				str: this.properties.desc,
				pos: { x: 30, y: (150 - md_canvas.getTextHeight({ fontSize: 30, line: { w: 480, h: 42 }, str: this.properties.desc })) / 2 + 30 },
				line: { w: 480, h: 42 },
				font: 'normal bold ' + 30 * this.properties.rate + 'px sans-serif',
				color: '#000'
			})
			//绘竖线分割
			md_canvas.drawLine({
				line: { width: 2, color: '#d3d3d3' },
				start: { x: 542, y: 26 },
				end: { x: 542, y: 126 }
			})
			//绘二维码
			md_canvas.drawImage({
				imgUrl: '/images/common/qrcode.png',
				pos: { x: 570, y: 0 },
				size: { w: 150, h: 150 }
			})
		},

		/**
        	获取最大尺标
        	@param
        	@return {number} 最大尺标
         */
		getMax() {
			let max = 100
			for (let i = 0; i < this.properties.dataList.length; i++) {
				if (max < this.properties.dataList[i]) {
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
		},

		/**
        	获取图片路径
        	@param
        	@return {String} 海报图片路径
         */
		getImgSrc() {
			return this.data.canvasImg
		}
	}
})