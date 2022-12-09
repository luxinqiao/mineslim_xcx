const md_request = require('../../../utils/request.js')
const md_common = require('../../../utils/common.js')
const md_auth = require('../../../utils/authorize.js')
const md_app = getApp()


Page({
	data: {
        paramObj: {},
		versionObj: {     //版本号
			lastTime: 0,
			isVersion: true,
			version: md_app.globalData.version,
			subVersion: md_app.globalData.subVersion
        },
        dataObj: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 * @param {Object} options 页面参数
     * @return
	 */
	onLoad(options) {
        this.setData({
            paramObj: options
        },()=>{
            this.initPage()
            this.initData()
        })
    },
    
    /**
	 * 生命周期函数--监听页面显示
	 * @param 
     * @return
	 */
    onShow() {
		this.initData()
    },

	/**
     * 初始化页面
     * @param 
     * @return
     */
    initPage: function() {
        this.setData({
            'versionObj.lastTime': 0,
            'versionObj.isVersion': true
        })
    },

    /**
     * 初始化数据
     * @param 
     * @return
     */
    initData() {
        md_request.api({
			path: md_request.config.yy + '/wechat/my/index',
			data: {
				token: wx.getStorageSync('token')
            },
            isTourist: true,
			callback: res => {
				if (res.data.code == '200') {
                    let data = res.data.data
                    if(this.data.dataObj.is_login == 1 && data.is_login != 1 && this.data.paramObj.isFrom!='login') {
                        md_app.globalData.token = ''
				        wx.setStorageSync('token','')
                        wx.showToast({
                            title: '登录已失效，请重新登录',
                            icon: 'none',
                            duration: 2000,
                            mask: true
                        })
                        setTimeout(()=>{
                            this.setData({
                                dataObj: {}
                            })
                        },2000)
                    } else {
                        if(data.is_login == 1) {
                            this.setData({
                                dataObj: res.data.data
                            })
                        } else {
                            this.setData({
                                dataObj: {}
                            })
                        }
                    }
				} else {
                    this.setData({
						dataObj: {}
					})
                }
			}
		})
    },

	/**
     * 点击客服
     * @param {Dom} e 点击事件事件参数
     * @return
     */
    callService(e) {
        wx.makePhoneCall({
            phoneNumber: `${e.currentTarget.dataset.phone}`
        })
	},

    /**
     * 登录
     * @param 
     * @return
     */
    goLogin() {
        wx.navigateTo({
          url: '/pages/sys/login/index/index'
        })
    },

	/**
     * 去我的信息
     * @param 
     * @return
     */
	goInfo(){
        md_auth.checkToken({
			callbackFn:(e)=>{
				if(e.isToken) {
					wx.navigateTo({
						url: '/pages/my/info/info'
					})
				}
			}
		})
	},

	/**
     * 去我的报告
     * @param 
     * @return
     */
	goReport(){
        md_auth.checkToken({
			callbackFn:(e)=>{
				if(e.isToken) {
					wx.navigateTo({
						url: '/pages/my/report/list/list'
					})
				}
			}
		})
	},

	/**
     * 去我的记录
     * @param 
     * @return
     */
	goRecord(){
        md_auth.checkToken({
			callbackFn:(e)=>{
				if(e.isToken) {
					wx.navigateTo({
						url: '/pages/my/record/list/list'
					})
				}
			}
		})
	},

	/**
     * 去意见反馈页面
     * @param 
     * @return
     */
	goFeedback(){
        md_auth.checkToken({
			callbackFn:(e)=>{
				if(e.isToken) {
					wx.navigateTo({
						url: '/pages/my/feedback/feedback'
					})
				}
			}
		})
	},

	
    /**
     * 双击切换版本号
     * @param {dom} e 版本号
     * @return
     */
    getVersion: function (e) {
        let thisTime = e.timeStamp
        let lastTime = this.data.versionObj.lastTime // 获取上次点击时间 默认为0
        let isVersion = this.data.versionObj.isVersion
        if (lastTime != 0) {
            if (thisTime - this.data.versionObj.lastTime < 300)
                this.setData({
                    'versionObj.isVersion': !isVersion
                })
        }
        this.setData({
            'versionObj.lastTime': thisTime
        })
	},
	
	/**
     * 退出登录
     * @param 
     * @return
     */
    logout: function () {
		if(md_common.isEmpty(wx.getStorageSync('token'))) {
			this.selectComponent('#mdDialog').tip('还未登录')
		} else {
			this.selectComponent('#mdDialog').confirm('确认退出登录吗？', '取消', () => { }, '确认', () => {
                setTimeout(()=>{
                    this.selectComponent('#mdDialogs').tip('退出登录成功')
                },100)
                md_app.globalData.token = ''
				wx.setStorageSync('token','')
                this.onLoad({
                    isFrom: 'login'
                })
			})
		}
    }
})