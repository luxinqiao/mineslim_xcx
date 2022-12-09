const md_request = require('../../../utils/request.js')
const md_dict = require('../../../utils/dict.js')

Page({
	data: {
		knowObj: {
			consume: '--',
			count: '--',
			kind: '--',
			desc: '--'
		},
		compareLeftObj: {
			consume: '--',
			count: '--',
			kind: '--',
			desc: '--'
		},
		compareRightObj: {
			consume: '--',
			count: '--',
			kind: '--',
			desc: '--'
		},
		searchType: 'know',
		searchDataArr: [],
		selectKnowObj: {
			id: 0,
			name: '运动名称'
		},
		selectCompareLeftObj: {
			id: 0,
			name: '运动名称'
		},
		selectCompareRightObj: {
			id: 0,
			name: '运动名称'
		},
		currPage: 1,
		isLastPage: false
	},

	/**
    	生命周期函数--监听页面加载
     	@param
    	@return
     */
	onLoad() {
		md_request.api({
			path: md_request.config.yy + '/wechat/discover/get-result',
			data: {
				type: md_dict.findType.SPORT
			},
			callback: res => {
				if (res.data.code == '200') {
					if (this.data.searchType == 'know') {
						this.setData({
							knowObj: {
								consume: res.data.data.consume,
								count: res.data.data.times + res.data.data.times_unit,
								kind: res.data.data.kind+'运动',
								desc: res.data.data.desc
							},
							selectKnowObj: {
								name: res.data.data.name
							}
						})
					}
				}
			}
		})
	},

	/**
		搜索名称
		@param
		@return
	 */
	searchName(e) {
		this.setData({
			searchType: e.currentTarget.dataset.type,
			currPage: 1,
			isLastPage: false
		})
		this.selectComponent('#mdSearch').show()
	},

	/**
		绑定mdSearch组件查询事件
		@param {dom} e 搜索框
		@return
	 */
	bindSearch(e) {
		if (e.detail.isFirstPage) {
			this.setData({
				currPage: 1,
				searchDataArr: []
			})
		} else {
			if (this.data.isLastPage) {
				return
			}
			this.setData({
				currPage: this.data.currPage + 1
			})
		}
		md_request.api({
			path: md_request.config.yy + '/wechat/discover/find-search-list',
			data: {
				type: md_dict.findType.SPORT,
				content: e.detail.content,
				page: this.data.currPage
			},
			callback: res => {
				if (res.data.code == '200') {
					if (res.data.data.is_last_page == '1') {
						this.setData({
							isLastPage: true
						})
					}
					this.setData({
						searchDataArr: this.data.searchDataArr.concat(res.data.data.list)
					})
					this.selectComponent('#mdSearch').initData(this.data.searchDataArr)
					if (res.data.data.is_last_page == '1') {
						this.setData({
							isLastPage: true
						})
					}
				}
			}
		})
	},
	/**
		绑定mdSearch组件选中事件
		@param {dom} e 搜索
		@return
	 */
	bindCheckResult(e) {
		if (this.data.searchType == 'know') {
			this.setData({
				selectKnowObj: e.detail
			})
		} else if (this.data.searchType == 'compareLeft') {
			this.setData({
				selectCompareLeftObj: e.detail
			})
		} else if (this.data.searchType == 'compareRight') {
			this.setData({
				selectCompareRightObj: e.detail
			})
		}
		md_request.api({
			path: md_request.config.yy + '/wechat/discover/get-result',
			data: {
				type: md_dict.findType.SPORT,
				id: e.detail.id
			},
			callback: res => {
				if (res.data.code == '200') {
					if (this.data.searchType == 'know') {
						this.setData({
							knowObj: {
								consume: res.data.data.consume,
								count: res.data.data.times + res.data.data.times_unit,
								kind: res.data.data.kind+'运动',
								desc: res.data.data.desc
							}
						})
					} else if (this.data.searchType == 'compareLeft') {
						this.setData({
							compareLeftObj: {
								consume: res.data.data.consume,
								count: res.data.data.times + res.data.data.times_unit,
								kind: res.data.data.kind+'运动',
								desc: res.data.data.desc
							}
						})
					} else if (this.data.searchType == 'compareRight') {
						this.setData({
							compareRightObj: {
								consume: res.data.data.consume,
								count: res.data.data.times + res.data.data.times_unit,
								kind: res.data.data.kind+'运动',
								desc: res.data.data.desc
							}
						})
					}
				}
			}
		})
	}
})