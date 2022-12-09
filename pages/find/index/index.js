Page({
	data: {

	},

	/**
    	跳转-营养知多少
    	@param
    	@return
     */
	goFood() {
		wx.navigateTo({
			url: '../food/food'
		})
	},
	/**
    	跳转-运动知多少
    	@param
    	@return
     */
	goSport() {
		wx.navigateTo({
			url: '../sport/sport'
		})
	}
})