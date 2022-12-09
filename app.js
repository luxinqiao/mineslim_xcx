App({
	/**
		小程序初始化加载
		@param
		@return
	 */
	onLaunch: function () {
		this.onNetworkStatusChange()
	},

	/* 内部数据 */
	data: {
		isNetwork: true
	},
	/* 全局数据 */
	globalData: {
		userInfo: {},
		token: wx.getStorageSync('token'),
		version: '1.0.0',
		subVersion: '1.0.0.7',
		isHasClick: false
	},

	/**
		监听网络状态改变
		@param
		@return
	 */
	onNetworkStatusChange: function () {
		wx.onNetworkStatusChange((res) => {
			if (!res.isConnected) {
				wx.showToast({
					title: '网络连接不可用',
					icon: 'none',
					duration: 2000
				})
				this.data.isNetwork = false
			} else {
				if (!this.data.isNetwork) {
					wx.showToast({
						title: '网络已连接',
						icon: 'none',
						duration: 2000
					})
					this.data.isNetwork = true
				}
			}
		})
	}
})