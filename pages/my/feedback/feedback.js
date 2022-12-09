const md_request = require('../../../utils/request.js')
const md_common = require('../../../utils/common.js')
const md_upImg = require('../../../utils/uploadImg.js')

Page({
    data: {
        contentData: '',
        uploadObj: {
            max: 3,
            picsArr: [], // 带oss前缀的地址（用于前端展示）
            picsCutArr: [] // 不带oss前缀的地址（用于传给后台）
        }
    },

    /**
     * 监听内容输入
     * @param {dom} e 内容输入
     * @return
     */
    content: function(e) {
        this.setData({
            contentData: md_common.trimStr(e.detail.value)
        })
    },

    /**
     * 上传图片
     * @param 
     * @return
     */
    upload: function() {
        md_upImg.uploadImg({
            num: this.data.uploadObj.max, 
            successCallback:(res)=> {
                for (let index in res) {
                    if (this.data.uploadObj.picsArr.length < 3) {
                        let picsArr = this.data.uploadObj.picsArr
                        let picsCutArr = this.data.uploadObj.picsCutArr
                        picsArr.push(res[index].url)
                        picsCutArr.push(res[index].urlCut)
                        this.setData({
                            'uploadObj.picsArr': picsArr,
                            'uploadObj.picsCutArr': picsCutArr
                        })
                    }
                }

                let num = 3 - this.data.uploadObj.picsArr.length
                this.setData({
                    'uploadObj.max': num
                })
            }
        })
    },

    /**
     * 删除图片
     * @param {dom} e 删除图片
     * @return
     */
    cancle: function(e) {
        let index = e.currentTarget.dataset.index
        let picsArr = this.data.uploadObj.picsArr
        let picsCutArr = this.data.uploadObj.picsCutArr
        picsArr.splice(index, 1)
        picsCutArr.splice(index, 1)
        let num = this.data.uploadObj.max + 1
        this.setData({
            'uploadObj.picsArr': picsArr,
            'uploadObj.picsCutArr': picsCutArr,
            'uploadObj.max': num
        })
    },

    /**
     * 提交
     * @param 
     * @return
     */
    submit: function() {
		if (md_common.isEmpty(this.data.contentData)) {
            this.selectComponent('#mdDialog').tip('请填写反馈内容')
        } else {
            md_request.api({
                path: md_request.config.yy + '/wechat/my/feedback',
                data: {
                    token: wx.getStorageSync('token'),
                    content: this.data.contentData,
                    image: JSON.stringify(this.data.uploadObj.picsCutArr)
                },
                callback: (res) => {
                    if (res.data.code == '200') {
                        this.selectComponent('#mdDialog').tip('反馈成功', () => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 2000)
                    } else {
                        this.selectComponent('#mdDialog').tip(res.data.note)
                    }
                }
            })
        }
    }
})