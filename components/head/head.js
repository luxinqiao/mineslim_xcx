Component({
	/** 外部属性 **/
	properties: {
		isBack: {
			type: Boolean,
			value: true
		},
		title: {
			type: String,
			value: ''
		},
		titleStyle: {
			type: String,
			value: ''
		}
	},

	/** 内部属性 **/
	data: {

	},

	/** 组件方法 **/
	methods: {
		/**
        	返回
        	@param
        	@return
         */
		goBack: function() {
			wx.navigateBack({
				delta: 1
			})
		}
	}
})
