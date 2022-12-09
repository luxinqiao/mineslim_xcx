const md_common = require('../../../../utils/common.js')
const md_request = require('../../../../utils/request.js')

Page({
	data: {
		tabName: 'sport',

		sportObj: {
			dataArr: [],
			pageIndex: 1,
			is_last: 0,
			isReady: false,
			isNewShow: false,
			isLoading: false
		},
		foodObj: {
			dataArr: [],
			pageIndex: 1,
			is_last: 0,
			isReady: false,
			isNewShow: false,
			isLoading: false
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 * @param
     * @return
	 */
	onLoad: function () {
		this.initSportData()
		this.initFoodData()
	},

	/**
	 * 初始化运动记录
	 * @param
     * @return
	 */
	initSportData() {
		if (this.data.sportObj.is_last == '1') {
			return
		}
		const pageIndex = this.data.sportObj.pageIndex
		md_request.api({
			path: md_request.config.yy + '/wechat/my/my-record',
			data: {
				token: wx.getStorageSync('token'),
				type: 1,
				page: pageIndex,
				page_size: 15
			},
			callback: (res) => {
				this.setData({
					'sportObj.isLoading': false
				})
				if(this.data.sportObj.isNewShow) {
					wx.stopPullDownRefresh()
					this.setData({
						'sportObj.isNewShow': false
					})
				}
				if (res.data.code != '200') {
					return
				}
				const listArr = res.data.data.list
				let tempArr = this.data.sportObj.dataArr
				if(pageIndex == 1) {
					this.setData({
						'sportObj.dataArr': listArr
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
						'sportObj.dataArr': tempArr
					})
				}
				this.setData({
					'sportObj.is_last': res.data.data.is_last_page,
					'sportObj.isReady': true
				})
			}
		})
	},

	/**
	 * 初始化运动记录
	 * @param
     * @return
	 */
	initFoodData() {
		if (this.data.foodObj.is_last == '1') {
			return
		}
		const pageIndex = this.data.foodObj.pageIndex
		md_request.api({
			path: md_request.config.yy + '/wechat/my/my-record',
			data: {
				token: wx.getStorageSync('token'),
				type: 2,
				page: pageIndex,
				page_size: 15
			},
			callback: (res) => {
				this.setData({
					'foodObj.isLoading': false
				})
				if(this.data.foodObj.isNewShow) {
					wx.stopPullDownRefresh()
					this.setData({
						'foodObj.isNewShow': false
					})
				}
				if (res.data.code != '200') {
					return
				}
				const listArr = res.data.data.list
				let tempArr = this.data.foodObj.dataArr
				if(pageIndex == 1) {
					this.setData({
						'foodObj.dataArr': listArr
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
						'foodObj.dataArr': tempArr
					})
				}
				this.setData({
					'foodObj.is_last': res.data.data.is_last_page,
					'foodObj.isReady': true
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
		if(this.data.tabName == 'sport') {
			this.setData({
				sportObj: {
					dataArr: [],
					pageIndex: 1,
					is_last: 0,
					isReady: false,
					isNewShow: true,
					isLoading: false
				}
			},()=>{
				this.initSportData()
			})
		} else {
			this.setData({
				foodObj: {
					dataArr: [],
					pageIndex: 1,
					is_last: 0,
					isReady: false,
					isNewShow: true,
					isLoading: false
				}
			},()=>{
				this.initFoodData()
			})
		}
	},

	/**
	 * 页面上拉触底事件的处理函数
	 * @param
	 * @return
	 */
	onReachBottom() {
		if(this.data.tabName == 'sport') { 
			if (this.data.sportObj.is_last == '0') {
				this.setData({
					'sportObj.pageIndex': this.data.sportObj.pageIndex + 1
				}, () => {
					this.setData({
						'sportObj.isLoading': false
					})
					this.initSportData()
				})
			}
		} else {
			if (this.data.foodObj.is_last == '0') {
				this.setData({
					'foodObj.pageIndex': this.data.foodObj.pageIndex + 1
				}, () => {
					this.setData({
						'foodObj.isLoading': false
					})
					this.initFoodData()
				})
			}
		}
	},

	/**
     * 切换tab
     * @param {dom} e 所切的tab
     * @return
     */
	changeTab(e) {
		let name = e.currentTarget.dataset.name
		if(name!=this.data.tabName) {
			this.setData({
				tabName: name
			})
		}
	},

	/**
     * 去详情页
     * @param {dom} e 点击的内容
     * @return
     */
	goDetail(e) {
		if(this.data.tabName=='sport') {
			wx.navigateTo({
				url: `/pages/my/record/detail/sport/detail?id=${e.currentTarget.dataset.id}&date=${e.currentTarget.dataset.date}&type=${e.currentTarget.dataset.type}&markId=${e.currentTarget.dataset.markid}`
			})
		} else {
			wx.navigateTo({
				url: `/pages/my/record/detail/food/detail?id=${e.currentTarget.dataset.id}&date=${e.currentTarget.dataset.date}&name=${e.currentTarget.dataset.name}&markId=${e.currentTarget.dataset.markid}`
			})
		}
	}
})