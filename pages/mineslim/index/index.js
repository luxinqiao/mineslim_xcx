const md_request = require('../../../utils/request.js')
const md_common = require('../../../utils/common.js')
const md_auth = require('../../../utils/authorize.js')

Page({
	data: {
		paramObj: {},
		isTop: false,
		canvasW: 350,
		canvasH: 190,

		reportObj: {},  //顶部数据-健康得分
		targetObj: {},  //关键指标
		trendObj: {}    //健康指数趋势
	}, 

	/**
	 * 生命周期函数--监听页面加载
	 * @param {object} options 链接参数
     * @return
	 */
	onLoad(options) {
		this.setData({
			paramObj: options
		},()=>{
			this.initReportData()
			this.initTargetData()
			if(options.isFrom!='login') {
				this.initTrendData()
			} 
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 * @param 
     * @return
	 */
	onShow() {
		if(this.data.paramObj.isFrom=='login') {
			this.initTrendData()
		}
	},

	/**
     * 初始化健康得分 
     * @param
     * @return
     */
	initReportData(){
		md_request.api({
			path: md_request.config.yy + '/wechat/home/report',
			data: {
				token: wx.getStorageSync('token')
			},
			isTourist: true,
			callback: res => {
				if (res.data.code == '200') {
					this.setData({
						reportObj: res.data.data
					})
				} else {
					this.setData({
						reportObj: {}
					})
				}
			}
		})
	},

	/**
     * 初始化关键指标
     * @param
     * @return
     */
	initTargetData(){
		md_request.api({
			path: md_request.config.yy + '/wechat/home/target',
			data: {
				token: wx.getStorageSync('token')
			},
			isTourist: true,
			callback: res => {
				if (res.data.code == '200') {
					let data = res.data.data
					if(!md_common.isEmpty(data.gmt_create)) {
						data.gmt_create = data.gmt_create.replace(/-/g, '.')
					}
					this.setData({
						targetObj: res.data.data
					})
				} else {
					this.setData({
						targetObj: {}
					})
				}
			}
		})
	},

	/**
     * 初始化健康趋势图
     * @param
     * @return
     */
	initTrendData(){
		md_request.api({
			path: md_request.config.yy + '/wechat/home/trend',
			data: {
				token: wx.getStorageSync('token')
			},
			isTourist: true,
			callback: res => {
				if (res.data.code == '200') {
					let data = res.data.data
					let length = data.list.length
					let dataArr = []
					if(length<7) {
						for(let i = 0;i<(7-length);i++) {
							dataArr[i]= ''
							if(i==(6 - length)) {
								data.list = dataArr.concat(data.list)
								this.setData({
									trendObj: res.data.data
								},()=>{
									this.selectComponent('#mdTrendChart').beginDraw({successFun: ()=> {}})
								})
							}
						}
					} else {
						this.setData({
							trendObj: res.data.data
						},()=>{
							this.selectComponent('#mdTrendChart').beginDraw({successFun: ()=> {}})
						})
					}
				} else {
					this.setData({
						'trendObj.list': ['','','','','','','']
					},()=>{
						this.selectComponent('#mdTrendChart').beginDraw({successFun: ()=> {}})
					})
				}
			}
		})
	},

	/**
     * 页面滚动事件 
     * @param {dom} e  页面滚动事件携带参数
     * @return
     */
    onPageScroll(e) {
		let query = this.createSelectorQuery()
		query.select('#indic').boundingClientRect()
		query.exec((rect)=>{
			if(Number(rect[0].top)<85) {
				if(!this.data.isTop) {
					this.setData({
						isTop: true
					})
				}
			} else {
				if(this.data.isTop) {
					this.setData({
						isTop: false
					})
				}
			}
		})
	},
	
	/**
	 * 关键指标详情
	 * @param 
     * @return
	 */
	introdIndicators() {
		this.selectComponent('#mdPopup').showPopup()
	},

	/**
	 * 编辑关键指标
	 * @param 
     * @return
	 */
	changeIndicators() {
		md_auth.checkToken({
			callbackFn:(e)=>{
				if(e.isToken) {
					if(md_common.isEmpty(this.data.reportObj)) {
						this.selectComponent('#mdDialog').tip('暂无报告数据')
					} else {
						wx.navigateTo({
							url: '/pages/mineslim/kpi/edit/edit'
						})
					}
				}
			}
		})
	},

	/**
	 * 历史记录
	 * @param 
     * @return
	 */
	goHistory() {
		md_auth.checkToken({
			callbackFn:(e)=>{
				if(e.isToken) {
					if(md_common.isEmpty(this.data.reportObj)) {
						this.selectComponent('#mdDialog').tip('暂无报告数据')
					} else {
						wx.navigateTo({
							url: '/pages/mineslim/history/history'
						})
					}
				}
			}
		})
	},

	/**
	 * 深度解码
	 * @param 
     * @return
	 */
	goDecode() {
		md_auth.checkToken({
			callbackFn:(e)=>{
				if(e.isToken) {
					if(md_common.isEmpty(this.data.reportObj)) {
						this.selectComponent('#mdDialog').tip('暂无报告数据')
					} else {
						wx.navigateTo({
							url: '/pages/mineslim/keepDecode/keepDecode'
						})
					}
				}
			}
		})
	},

	/**
	 * 健身营养
	 * @param 
     * @return
	 */
	goHealth() {
		md_auth.checkToken({
			callbackFn:(e)=>{
				if(e.isToken) {
					if(md_common.isEmpty(this.data.reportObj)) {
						this.selectComponent('#mdDialog').tip('暂无报告数据')
					} else {
						wx.navigateTo({
							url: '/pages/mineslim/health/index/index'
						})
					}
				}
			}
		})
	}
})