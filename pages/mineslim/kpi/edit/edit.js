const md_request = require('../../../../utils/request.js')
const md_common = require('../../../../utils/common.js')

Page({
	data: {
		currIndex: 0,
		hasDataArr: {},
		addDataObj: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 * @param
     * @return
	 */
	onLoad() {
		this.initHasData()
		this.initAddData()
	},

	/**
     * 初始化已添加的数据 
     * @param
     * @return
     */
	initHasData(){
		md_request.api({
			path: md_request.config.yy + '/wechat/target',
			data: {
				token: wx.getStorageSync('token')
			},
			callback: res => {
				if (res.data.code == '200') {
					this.setData({
						hasDataArr: res.data.data
					})
				} else {
					this.setData({
						hasDataArr: []
					})
				}
			}
		})
	},

	/**
     * 初始化未添加的数据 
     * @param
     * @return
     */
	initAddData(){
		md_request.api({
			path: md_request.config.yy + '/wechat/target/list',
			data: {
				token: wx.getStorageSync('token')
			},
			callback: res => {
				if (res.data.code == '200') {
					this.setData({
						addDataObj: res.data.data
					})
				} else {
					this.setData({
						addDataObj: {}
					})
				}
			}
		})
	},

	/**
     * 增加新指标
     * @param 
     * @return
     */
	add() {
		if(this.data.addDataObj.id.length>0) {
			this.selectComponent('#mdSelect').show()
		} else {
			this.selectComponent('#mdDialog').tip('指标已全部添加')
		}
	},

	/**
     * 实时绑定选择项
     * @param {dom} e 选择项
     * @return
     */
	bindComplete(e) {
		md_request.api({
			path: md_request.config.yy + '/wechat/target/add',
			data: {
				token: wx.getStorageSync('token'),
				target_id: this.data.addDataObj.id[e.detail]
			},
			callback: res => {
				if (res.data.code == '200') {
					this.setData({
						currIndex: 0
					},()=>{
						this.initHasData()
						this.initAddData()
						md_common.getPrePage().initTargetData()
					})
				}
			}
		})
	},

	/**
     * 删除
     * @param {dom} e 选择项
     * @return
     */
	dele(e) {
		md_request.api({
			path: md_request.config.yy + '/wechat/target/delete',
			data: {
				token: wx.getStorageSync('token'),
				target_id: e.currentTarget.dataset.id
			},
			callback: res => {
				if (res.data.code == '200') {
					this.setData({
						currIndex: 0
					},()=>{
						this.initHasData()
						this.initAddData()
						md_common.getPrePage().initTargetData()
					})
				}
			}
		})
	}
})