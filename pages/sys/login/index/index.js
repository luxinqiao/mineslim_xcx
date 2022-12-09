const md_request = require('../../../../utils/request.js')
const md_common = require('../../../../utils/common.js')
const md_reg = require('../../../../utils/reg.js')
const md_app = getApp()

Page({
	data: {
		isFocusPhone: false,
		isFocusCode: false,
		isCheck: true,
		phone: '',
		code: '',
		isCount: false,
		btnText: "获取验证码",
		version: md_app.globalData.version
	},

	/**
		生命周期函数--监听页面加载
		@param {Object} options 页面参数
		@return
	 */
	onLoad: function (options) {
		this.setData({
			paramObj: options
		})
	},
	
	/**
		生命周期函数--监听页面显示
		@param
		@return
	 */
	onShow() {
		if(this.data.paramObj.isInvalid) {
			getCurrentPages().map((item) => {
				if(item.route=='pages/mineslim/index/index') {  //判断首页
					item.onLoad({isFrom:'login'})
				}else if(item.route=='pages/my/index/index') {  //判断首页
					item.onLoad({isFrom:'login'})
				} else {
					item.onLoad(item.options)
				}
			})
		}
	},

	/**
		输入手机号
		@param
		@return
	 */
	inputPhone: function (e) {
		this.setData({
			phone: e.detail.value
		})
	},
	/**
		聚焦手机号
		@param
		@return
	 */
	focusPhone: function () {
		this.setData({
			isFocusPhone: true
		})
	},
	/**
		失焦手机号
		@param
		@return
	 */
	blurPhone: function () {
		this.setData({
			isFocusPhone: false
		})
	},
	/**
		输入验证码
		@param
		@return
	 */
	inputCode: function (e) {
		this.setData({
			code: e.detail.value
		})
	},
	/**
		聚焦验证码
		@param
		@return
	 */
	focusCode: function () {
		this.setData({
			isFocusCode: true
		})
	},
	/**
		失焦验证码
		@param
		@return
	 */
	blurCode: function () {
		this.setData({
			isFocusCode: false
		})
	},

	/**
		切换用户协议选中
		@param
		@return
	 */
	changeCheck: function () {
		this.setData({
			isCheck: !this.data.isCheck
		})
	},

	/**
		跳转-用户协议
		@param
		@return
	 */
	goAgent: function () {
		wx.navigateTo({
			url: '/pages/sys/login/agent/agent'
		})
	},

	/**
		获取验证码
		@param
		@return
	 */
	queryCode() {
		if (this.data.isCount) {
			return
		}
		if (md_common.isEmpty(this.data.phone)) {
			this.selectComponent('#mdDialog').tip('请输入手机号')
			return
		}
		if (!md_reg.validPhone(this.data.phone)) {
			this.selectComponent('#mdDialog').tip('请输入正确的手机号')
			return
		}

		md_request.api({
			path: md_request.config.yy + '/common/sms/send',
			data: {
				phone: this.data.phone,
				msg_type: 1
			},
			callback: res => {
				if (res.data.code == '200') {
					this.selectComponent('#mdDialog').tip('验证码已发送')
					this.setData({
						isCount: true,
						btnText: '60s'
					})
					let second = 60
					let countInterval = setInterval(() => {
						if (--second === 0) {
							clearInterval(countInterval)
							this.setData({
								isCount: false,
								btnText: '获取验证码'
							})
						} else {
							this.setData({
								btnText: `${second}s`
							})
						}
					}, 1000)
				} else {
					this.selectComponent('#mdDialog').tip(res.data.note)
				}
			}
		})
	},

	/**
		登录
		@param
		@return
	 */
	login: function () {
		if (md_common.isEmpty(this.data.phone)) {
			this.selectComponent('#mdDialog').tip('请输入手机号')
			return
		}
		if (!md_reg.validPhone(this.data.phone)) {
			this.selectComponent('#mdDialog').tip('请输入正确的手机号')
			return
		}
		if (md_common.isEmpty(this.data.code)) {
			this.selectComponent('#mdDialog').tip('请输入验证码')
			return
		}
		if (!md_reg.validCode(this.data.code)) {
			this.selectComponent('#mdDialog').tip('请输入正确的验证码')
			return
		}
		if (!this.data.isCheck) {
			this.selectComponent('#mdDialog').tip('请勾选用户协议')
			return
		}

		md_request.api({
			path: md_request.config.yy + '/wechat/auth/login',
            data: {
                phone: this.data.phone,
                code: this.data.code
            },
            callback: res => {
                if (res.data.code != '200') {
					this.selectComponent('#mdDialog').tip(res.data.note)
                    return
                }
				md_app.globalData.token = res.data.data.token
				wx.setStorageSync('token',res.data.data.token)
				getCurrentPages().map((item) => {
					if(item.route=='pages/mineslim/index/index') {  //判断首页
						item.onLoad({isFrom:'login'})
					} else {
						item.onLoad(item.options)
					}
                })
				wx.navigateBack({
					delta: 1
				})
            }
        })
	},

	/**
        生命周期函数--页面卸载
        @param
        @return
     */
    onHide: function () {
        md_app.globalData.isGoLogin = true
    },

    /**
        生命周期函数--页面销毁
        @param
        @return
     */
    onUnload: function () {
        md_app.globalData.isGoLogin = true
    }
})