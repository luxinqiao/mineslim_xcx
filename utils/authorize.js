/**
	文件描述：授权工具类
	创建人：卢信桥
	创建时间：2020-04-07
 */
const md_request = require('./request.js')
const md_common = require('./common.js')
const md_app = getApp()
const refuseText = '您已拒绝授权，请重新点击并授权'

/**
	校验token
	@param {Object} {
		{function} callbackFn 回调函数
		{Boolean} isGoLogin 是否跳登录页
		{Boolean} isTip 是否提示登录失效
	}
    @return
 */
function checkToken({callbackFn, isGoLogin=true, isTip=true}) {
	if (!wx.getStorageSync('token')) {
		if(isGoLogin) {
			wx.navigateTo({
				url: `/pages/sys/login/index/index`
			})
		}
		callbackFn({
			isToken: false
		})
		return
	}
	md_request.api({
		path: md_request.config.yy + '/wechat/auth/check',
		data: {
			"token": wx.getStorageSync('token')
		},
		isTourist: true,
		callback: res => {
			if (res.data.code == '200') {
				typeof (callbackFn) == 'function' ? callbackFn({ isToken: true }) : ''
			} else {
				md_app.globalData.token = ''
				wx.setStorageSync('token','')
				if(isTip) {
					wx.showToast({
						title: '登录已失效，请重新登录',
						icon: 'none',
						duration: 2000,
						mask: true
					})
				}
				setTimeout(() => {
					if(isGoLogin) {
						wx.navigateTo({
							url: `/pages/sys/login/index/index?isInvalid=true`
						})
					}
					typeof (callbackFn) == 'function' ? callbackFn({ isToken: false }) : ''
				}, 2000)
			}
		}
	})
}

/**
    微信授权-获得你的公开信息（昵称、头像、地区及性别）
    @param {dom} e 授权按钮
    @param {function} confirmCallback 允许回调
    @param {function} cancelCallback 拒绝回调
    @return
 */
function getUserInfo(e, confirmCallback, cancelCallback) {
	if (e.detail.userInfo) { //用户点击“允许”触发
		md_app.globalData.userInfo = e.detail.userInfo
		if (md_common.isEmpty(md_app.globalData.token)) {
			md_common.removebtnlimit()
			wx.navigateTo({
				url: '/pages/common/login/index/index'
			})
		} else {
			md_request.api({
				path: md_request.config.liveCommon + '/token/check',
				data: {
					token: md_app.globalData.token
				},
				"isTourist": true,
				callback: res => {
					if (res.data.code == '200') {
						return
					}
					if (md_app.globalData.isGoLogin == true) { 
						md_app.globalData.isGoLogin = false
						wx.showToast({
							title: '登录已失效，请重新登录',
							icon: 'none',
							duration: 2000,
							mask: true
						})
						setTimeout(() => {
							wx.navigateTo({
								url: '/pages/common/login/index/index'
							})
						}, 2000)
					}
				}
			})
			typeof (confirmCallback) == 'function' ? confirmCallback() : ''
		}
	} else { //用户点击“拒绝”触发
		typeof (cancelCallback) == 'function' ? cancelCallback() : ''
	}
}

/**
    保存至相册
	@param {Object} {
        {String} filePath 图片路径
        {Function} successCallback 成功回调函数
    }
    @return
 */
function saveToAlbum({ filePath, successCallback }) {
	wx.saveImageToPhotosAlbum({
		filePath: filePath,
		success: () => {
			successCallback()
		},
		fail: (res) => {
			if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
				wx.showModal({
					title: '提示',
					content: '需要您“授权保存到相册”',
					showCancel: false,
					success: modalSuccess => {
						wx.openSetting({
							success(settingdata) {
								if (settingdata.authSetting['scope.writePhotosAlbum']) {
									wx.showModal({
										title: '提示',
										content: '授权成功，再次点击图片即可保存',
										showCancel: false,
									})
								} else {
									wx.showModal({
										title: '提示',
										content: '授权失败，请重新点击“保存图片”',
										showCancel: false,
									})
								}
							}
						})
					},
					fail(failData) {

					},
					complete(finishData) {

					}
				})
			}
		}
	})
}

/**
 * 模块化导出
 */
module.exports = {
	checkToken: checkToken,
	getUserInfo: getUserInfo,
	refuseText: refuseText,
	saveToAlbum: saveToAlbum
}