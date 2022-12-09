Component({
	/** 外部属性 **/
	properties: {
		currActive: {
			type: String,
			value: 'home'
		}
	},

	/** 内部属性 **/
	data: {

	},

	/** 组件方法 **/
	methods: {
		/**
        	跳转页面
        	@param {dom} e 页面参数
        	@return
         */
		goPage: function (e) {
			const type = e.currentTarget.dataset.type
			if (type == this.properties.currActive) {
				return
			}
			if (type == 'home') {
				wx.reLaunch({
					url: '/pages/mineslim/index/index'
				})
			} else if (type == 'find') {
				wx.reLaunch({
					url: '/pages/find/index/index'
				})
			} else if (type == 'my') {
				wx.reLaunch({
					url: '/pages/my/index/index'
				})
			}
		}
	}
})