const md_common = require('../../utils/common.js')

Component({
	/** 外部属性 **/
	properties: {
		title: {
			type: String,
			value: ''
		}
	},

	/** 内部属性 **/
	data: {
		keyword: '',
		dataArr: [],
		isShow: false,
		animationData: {},
		isDataLoad: false
	},

	/** 组件方法 **/
	methods: {
		/**
        	初始化数据（业务调用）
        	@param
        	@return
         */
		initData(arr) {
			this.setData({
				isDataLoad: true,
				dataArr: arr
			})
		},
		/**
        	显示select组件
        	@param
        	@return
         */
		show() {
			this.setData({
				isDataLoad: false,
				isShow: true,
				keyword: '',
				dataArr: []
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
		close() {
			this.animation.translateY('100%').step()
			this.setData({
				animationData: this.animation.export()
			})
			setTimeout(() => {
				this.setData({
					isShow: false
				})
			}, 300)
		},
		/**
        	输入关键词
        	@param {dom} e 关键词
        	@return
         */
		inputKeyword(e) {
			this.setData({
				keyword: e.detail.value
			})
		},
		/**
        	搜索
        	@param
        	@return
         */
		search() {
			if (md_common.isEmpty(this.data.keyword)) {
				this.selectComponent('#mdDialog').tip('请输入关键词')
				return
			}
			this.triggerEvent('bindSearch', {
				content: this.data.keyword,
				isFirstPage: true
			})
		},
		/**
        	选中结果
        	@param {dom} e 搜索结果
        	@return
         */
		checkResult(e) {
			this.triggerEvent('bindCheckResult', this.data.dataArr[e.currentTarget.dataset.index])
			this.close()
		},
		/**
        	滚动条触底事件
        	@param
        	@return
         */
		scrolltolower() {
			this.triggerEvent('bindSearch', {
				content: this.data.keyword,
				isFirstPage: false
			})
		}
	}
})