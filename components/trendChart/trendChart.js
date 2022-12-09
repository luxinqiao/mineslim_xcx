const md_canvas = require('../../utils/canvas.js')
const md_common = require('../../utils/common.js')

Component({
	/** 外部属性 **/
	properties: {
		canvasW: {
			type: Number,
			value: 0
		},
		canvasH: {
			type: Number,
			value: 0
		},
		rate: {
			type: Number,
			value: 1
		},
		dataList: {
			type: Array,
			value: []
		}
	},

	/** 内部属性 **/
	data: {
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
		},

		/**
			绘画canvas
			@param
			@return
		 */
		drawCanvas() {
			md_canvas.clearDraw(0,0,this.properties.canvasW,this.properties.canvasH)
			const top = 36, bottom = 10
			const h = this.properties.canvasH - top - bottom
			//画虚线
			const avg = (this.properties.canvasW - 60) / (this.properties.dataList.length - 1)
			let x = 25
			for (let i = 0; i < this.properties.dataList.length; i++) {
				md_canvas.drawDash({
					start: { x: x, y: top },
					end: { x: x, y: h + top },
					line: { width: 2, color: '#d4d4d4' },
					dash: { length: [6, 6], pos: 0 }
				})
				x += avg
			}
			//画折线
			x = 25
			for (let i = 0; i < this.properties.dataList.length; i++) {
				if (md_common.isEmpty(this.properties.dataList[i])) {
					x += avg
					continue
				}
				const y = h + top - this.properties.dataList[i] * h / 100, nextY = h + top - this.properties.dataList[i + 1] * h / 100
				md_canvas.drawCircle({
					pos: { x: x, y: y },
					angle: { start: 0, end: 2 * Math.PI },
					r: 7,
					color: '#5A5AD1'
				})
				md_canvas.drawText({
					str: this.properties.dataList[i],
					pos: { x: x - md_canvas.getTextWidth({ fontSize: 18, str: this.properties.dataList[i] }) / 2, y: y - 15 },
					line: { w: 100, h: 26 },
					font: 'normal normal ' + 18 * this.data.rate + 'px sans-serif',
					color: '#333'
				})
				if (i < this.properties.dataList.length - 1) {
					if (!md_common.isEmpty(this.properties.dataList[i + 1])) {
						md_canvas.drawLine({
							start: { x: x, y: y },
							end: { x: x + avg, y: nextY },
							line: { width: 4, color: '#5A5AD1' }
						})
					}
				}
				x += avg
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