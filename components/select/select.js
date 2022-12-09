Component({
	/** 外部属性 **/
	properties: {
		title: {
			type: String,
			value: ''
		},
		dataList: {
			type: Array,
			value: []
		},
		currIndex: {
			type: Number,
			value: 0
		}
	},

	/** 内部属性 **/
	data: {
		isShow: false,
		currIndexArr: [0],
		animationData: {}
	},

	/**
        生命周期函数-组件实例进入页面节点
    	@param
    	@return
     */
	attached: function () {
		this.setData({
			currIndexArr: [this.properties.currIndex]
		})
	},

	/** 组件方法 **/
	methods: {
		/**
        	显示select组件
        	@param
        	@return
         */
		show: function () {
			this.setData({
				isShow: true
			})
			this.animation = wx.createAnimation({
				duration: 300,
				timingFunction: 'linear'
			})
			this.animation.translateY(0).step()
			this.setData({
				animationData: this.animation.export()
			})
		},
		/**
        	关闭select组件
        	@param
        	@return
         */
		close: function () {
			this.animation.translateY('100%').step()
			this.setData({
				animationData: this.animation.export()
			})
			setTimeout(()=>{
				this.setData({
					isShow: false
				})
			}, 300)
		},
		/**
        	picker选择切换
        	@param {dom} e picker选中
        	@return
         */
		changePicker: function (e) {
			this.setData({
				'currIndexArr[0]': e.detail.value[0]
			})
		},
		/**
        	绑定完成事件
        	@param
        	@return
         */
		bindComplete: function () {
			let currIndex = this.data.currIndexArr[0]
			if (currIndex > this.properties.dataList.length - 1) {
				currIndex = this.properties.dataList.length - 1
			}
			this.triggerEvent('bindComplete', currIndex)
			this.close()
		}
	}
})