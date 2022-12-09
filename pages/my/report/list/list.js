const md_common = require('../../../../utils/common.js')
const md_request = require('../../../../utils/request.js')

Page({
	data: {
		dataArr: [],
		pageIndex: 1,
		is_last: 0,
		isReady: false,
		isNewShow: false,
		isLoading: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 * @param 
     * @return
	 */
	onLoad() {
		this.initData()
	},

	/**
	 * 初始化数据
	 * @param 
     * @return
	 */
	initData() {
		if (this.data.is_last == '1') {
			return
		}
		const pageIndex = this.data.pageIndex
		md_request.api({
			path: md_request.config.yy + '/wechat/my/my-report',
			data: {
				token: wx.getStorageSync('token'),
				page: pageIndex,
				page_size: 15
			},
			callback: (res) => {
				this.setData({
					isLoading: false
				})
				if(this.data.isNewShow) {
					wx.stopPullDownRefresh()
					this.setData({
						isNewShow: false
					})
				}
				if (res.data.code != '200') {
					return
				}
				const listArr = res.data.data.list
				let tempArr = this.data.dataArr
				if(pageIndex == 1) {
					this.setData({
						dataArr: listArr
					})
				} else {
					if(tempArr[tempArr.length-1].month == listArr[0].month) {
						listArr.map((item,index)=>{
							if(index==0) {
								tempArr[tempArr.length-1].list = tempArr[tempArr.length-1].list.concat(listArr[index].list)
								listArr.splice(0,1)
							} 
						})
						tempArr = tempArr.concat(listArr)
					} else {
						tempArr = tempArr.concat(listArr)
					}
					this.setData({
						dataArr: tempArr
					})
				}
				this.setData({
					is_last: res.data.data.is_last_page,
					isReady: true
				})
			}
		})
	},

	/**
     * 页面相关事件处理函数--监听用户下拉动作
     * @param
     * @return
     */
    onPullDownRefresh() {
        this.setData({
			dataArr: [],
			pageIndex: 1,
			is_last: 0,
			isReady: false,
			isNewShow: true,
			isLoading: false
        },()=>{
			this.initData()
		})
	},

	/**
	 * 页面上拉触底事件的处理函数
	 * @param
	 * @return
	 */
	onReachBottom() {
		if (this.data.is_last == '0') {
			this.setData({
				pageIndex: this.data.pageIndex + 1
			}, () => {
				this.setData({
					isLoading: false
				})
				this.initData()
			})
		}
	},

	/**
     * 去详情页
     * @param {dom} e 点击的内容
     * @return
     */
	goDetail(e) {
		wx.navigateTo({
		  url: `/pages/my/report/detail/detail?id=${e.currentTarget.dataset.id}&date=${e.currentTarget.dataset.date}`,
		})
	}
})