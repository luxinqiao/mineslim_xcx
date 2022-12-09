/**
	文件描述：图片上传工具类
	创建人：卢信桥
	创建时间：2020-04-07
 */
const md_request = require('./request.js')
import { uploadFile } from '../third/ali-oss/alioss.js'

/**
	上传图片（手机拍照/相册选择）
	@param 
	@param {Object} {
        {Number} num 图片最大数量
        {Function} successCallback 成功回调
        {Function} failCallback 失败回调
    }
	@return
 */
const uploadImg = ({num, successCallback, failCallback}) => {
	wx.chooseImage({
		count: num,
		sizeType: ['original', 'compressed'],
		sourceType: ['album', 'camera'],
		success: function (res) {
			wx.showLoading({
				title: '图片上传中',
				mask: true
			})
			let srcArr = []
			for (let i = 0; i < res.tempFilePaths.length; i++) {
				uploadOss(res.tempFilePaths[i], (srcObj) => {
					srcArr.push(srcObj)
					if (srcArr.length==res.tempFilePaths.length) {
						wx.hideLoading({
                            complete: (res) => {},
                        })
						successCallback(srcArr)
					}
				})
			}
		},
		fail: function (error) {
			typeof failCallback == "function" && failCallback(error)
		}
	})
}

/**
	上传oss服务器
	@param {String} src 图片路径
	@param {Function} callback 成功后的回调函数
	@return
 */
const uploadOss = (src, callback) => {
	md_request.api({
		path: md_request.config.sts,
		data: {},
		callback: requestRes => {
			if (requestRes.data.status === 200) {
				uploadFile(src, {
					accessKeyID: requestRes.data.AccessKeyId,
					accessKeySecret: requestRes.data.AccessKeySecret,
					stsToken: requestRes.data.SecurityToken,
					host: md_request.config.oss,
					timeout: 87600
				}).then(function (uploadRes) {
					if (uploadRes.status && uploadRes.data.url) {
						callback(uploadRes.data)
					}
				}, function (uploadRes) {

				})
			} else {
				wx.showToast({
					title: '上传图片失败',
					icon: 'none',
					duration: 2000
				})
			}
		}
	})
}


module.exports = {
	uploadImg: uploadImg,
	uploadOss: uploadOss
}