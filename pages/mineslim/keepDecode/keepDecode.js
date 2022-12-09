const md_request = require('../../../utils/request.js')
const md_common = require('../../../utils/common.js')
const md_auth = require('../../../utils/authorize.js')

Page({
	data: {
		paramObj: {},
		tabName:'evaluate',
		dataObj: {},
		wheatObj: {},
		radarObj: {},
		isReady: false,
		isDrawFirst: false,
		
		drawObj: {      //是否绘图
            isFirst: false,
            isSuccess: false
        }
	},

	/**
	 * 生命周期函数--监听页面加载
	 * @param {object} options 链接参数
     * @return
	 */
	onLoad(options) {
		this.selectAllComponents('#mdDialog').map((item)=>{
			item.load()
		})
		this.setData({
			paramObj: options,
			tabName: md_common.isEmpty(options.tabName)?'evaluate': options.tabName
		})
		this.initAppraiseData()
		this.initWheatData()
	},

	/**
     * 初始化健康评价
     * @param 
     * @return
     */
	initAppraiseData(){
		let dataObj = {
            token: wx.getStorageSync('token')
        }
        if(!md_common.isEmpty(this.data.paramObj.id)) {
            dataObj.report_id = this.data.paramObj.id
        }
		md_request.api({
			path: md_request.config.yy + '/wechat/decode/appraise',
			data: dataObj,
			callback: res => {
				if (res.data.code == '200') {
					this.setData({
						dataObj: res.data.data
					},()=>{
						this.initRadarData()
						let dialog = this.selectAllComponents('#mdDialog')
						this.selectAllComponents('#mdIndexChart').map((item,index)=>{
							item.beginDraw({
								successFun:()=>{
									dialog[index].close()
								}
							})
						})
					})
				} 
			}
		})
	},

	/**
     * 初始化健康小麦
     * @param 
     * @return
     */
	initWheatData(){
		let dataObj = {
            token: wx.getStorageSync('token')
        }
        if(!md_common.isEmpty(this.data.paramObj.id)) {
            dataObj.report_id = this.data.paramObj.id
        }
		md_request.api({
			path: md_request.config.yy + '/wechat/decode/xiaomai',
			data: dataObj,
			callback: res => {
				if (res.data.code == '200') {
					this.setData({
						wheatObj: res.data.data
					})
				} 
			}
		})
	},

	/**
     * 初始化雷达图
     * @param 
     * @return
     */
	initRadarData(){
		md_request.api({
			path: md_request.config.yy + '/wechat/decode/radar',
			data: {
				token: wx.getStorageSync('token'),
				report_id: this.data.dataObj.report_id
			},
			callback: res => {
				if (res.data.code == '200') {
					this.setData({
						isReady: true,
						radarObj: res.data.data
					})
				} 
			}
		})
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
	 * 分享-出现弹窗
	 * @param
     * @return
	 */
	share() {
		this.selectComponent('#mdPopupShare').showPopup()
        if(!this.data.drawObj.isSuccess) {
            this.selectComponent('#mdDialogPop').loading()
        }
        if(!this.data.drawObj.isFirst) {
            this.setData({
                'drawObj.isFirst': true
            },()=>{
                this.selectComponent('#mdPoster').beginDraw({
                    successFun: ()=> {
                        this.setData({
                            'drawObj.isSuccess': true
                        },()=>{
                            this.selectComponent('#mdDialogPop').close()
                        })
                    }
                })
            })
        }
	},

	/**
     * 保存本地
     * @param 
     * @return
     */
    save() {
		md_auth.saveToAlbum({
            filePath: this.selectComponent('#mdPoster').getImgSrc(),
            successCallback: ()=>{
                this.selectComponent('#mdDialogAll').tip('图片已保存至相册')
            }
        })
    },

    /**
     * 用户点击右上角分享
	 * @param 
     * @return
     */
    onShareAppMessage: function () {
        return {
			title: '深度解码',
			imageUrl: this.selectComponent('#mdPoster').getImgSrc(),
			path: `/pages/mineslim/keepDecode/keepDecode?id=${this.data.dataObj.report_id}&tabName=${this.data.paramObj.tabName}&isShare=true`
		}
    }
})