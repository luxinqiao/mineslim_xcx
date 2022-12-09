const md_common = require('../../../../utils/common.js')
const md_request = require('../../../../utils/request.js')

Page({
	data: {
		paramObj: {},
		reportObj: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 * @param {object} options 链接
     * @return
	 */
	onLoad(options) {
		this.selectAllComponents('#mdDialog').map((item)=>{
			item.load()
		})
		this.setData({
			paramObj: options
		}, ()=>{
			wx.setNavigationBarTitle({
				title: '报告-' + options.date
			})
			this.initData()
		})
	},

	/**
     * 初始化数据
     * @param
     * @return
     */
	initData(){
		md_request.api({
			path: md_request.config.yy + '/wechat/my/report-detail',
			data: {
				token: wx.getStorageSync('token'),
				report_id: this.data.paramObj.id
			},
			isTourist: true,
			callback: res => {
				if (res.data.code == '200') {
					let data = res.data.data
					if(!md_common.isEmpty(data.report_time)) {
						data.report_time = data.report_time.replace(/-/g, '.')
					}
					this.setData({
						reportObj: data
					},()=>{
						let dialog = this.selectAllComponents('#mdDialog')
						this.selectAllComponents('#mdIndexChart').map((item,index)=>{
							item.beginDraw({
								successFun:()=>{
									dialog[index].close()
								}
							})
						})
					})
				} else {
					this.setData({
						reportObj: {}
					})
				}
			}
		})
	},
})