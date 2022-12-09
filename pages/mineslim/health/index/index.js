const md_auth = require('../../../../utils/authorize.js')
const md_common = require('../../../../utils/common.js')

Page({
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 * @param 
     * @return
	 */
	onLoad() {

	},

	/**
	 * 运动
	 * @param 
     * @return
	 */
	goSport() {
		md_auth.checkToken({
			callbackFn:(e)=>{
				if(e.isToken) {
					wx.navigateTo({
					  url: '/pages/mineslim/health/sport/index/index'
					})
				}
			}
		})
	},

	/**
	 * 食物
	 * @param 
     * @return
	 */
	goFood() {
		md_auth.checkToken({
			callbackFn:(e)=>{
				if(e.isToken) {
					wx.navigateTo({
					  url: '/pages/mineslim/health/food/index/index'
					})
				}
			}
		})
	},
})