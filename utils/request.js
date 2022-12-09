/**
    文件描述：接口请求工具类
    创建人：卢信桥
    创建时间：2020-04-07
 */
const requestType = 'test'
var requestConfig = {
	appKey: '41ca86957ee5c3056d9a407f828a0764',
	oss: 'https://rightinhome.oss-cn-hangzhou.aliyuncs.com'
}

if (requestType == 'test') {
	requestConfig.yy = 'https://api-yy.ltjk.info'
	requestConfig.sts = 'https://api-rih.ltjk.info/sts-server/sts.php'
	requestConfig.web = 'https://web.ltjk.info'
} else if (requestType == 'prod') {
	requestConfig.yy = 'https://api-common.wrightin.com/v1'
	requestConfig.sts = 'https://api-rih.wrightin.com/sts-server/sts.php'
	requestConfig.web = 'https://web.wrightin.com'
}

/**
	请求接口
	@param {Object} {
        {String} path 请求路径,
        {Object} data 请求参数,
        {Function} callback 回调方法,
		{Boolean} isCheck 是否校验验签
		{Boolean} isTourist 游客模式
    }
	@return
 */
function requestApi({ path, data, callback, isCheck, isTourist }) {
	const md_app = getApp()
	wx.request({
		url: path,
		header: {
			'REQUESTAPP': '1',
			'REQUESTCLIENT': '510',
			'VERSIONFORAPP': md_app.globalData.version,
			'content-type': 'application/json'
		},
		method: 'POST',
		data: isCheck == false ? data : require('../third/attestation.js').init(data),
		success: function (res) {
			if (res.data.code == 3 || res.data.code == 102 || res.data.code == 201) {
				wx.setStorageSync('token','')
				md_app.globalData.token = ''
				if (!isTourist){
					if (getApp().globalData.isGoLogin == true) {
						getApp().globalData.isGoLogin = false
						wx.showToast({
							title: '登录已失效，请重新登录',
							icon: 'none',
							duration: 2000
						})
						setTimeout(() => {
							wx.navigateTo({
								url: '/pages/sys/login/index/index'
							})
						}, 2000)
					}
					return
				}
			}
			typeof callback == "function" && callback(res)
		},
		fail: function (res) {
			typeof callback == "function" && callback(res)
		}
	})
}

module.exports = {
	api: requestApi,
	config: requestConfig
}