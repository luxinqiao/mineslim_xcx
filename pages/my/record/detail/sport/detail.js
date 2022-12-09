const md_request = require('../../../../../utils/request.js')
const md_auth = require('../../../../../utils/authorize.js')

Page({
    data: {
        paramObj: {},
        dataObj: {},
        isReady: false,
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
    onLoad: function (options) {
        this.selectComponent('#mdDialog').loading()
        this.setData({
            paramObj: options
        },()=>{
            this.initData()
        })
    },

    /**
     * 初始化方案 
     * @param
     * @return
     */
	initData(){
		md_request.api({
			path: md_request.config.yy + '/wechat/my/sport-record-detail',
			data: {
                token: wx.getStorageSync('token'),
                record_id: this.data.paramObj.id,
                type: this.data.paramObj.type,
                mark_id: this.data.paramObj.markId
			},
			callback: res => {
                this.setData({
                    isReady: true
                })
                this.selectComponent('#mdDialog').close()
				if (res.data.code == '200') {
					this.setData({
						dataObj: res.data.data
					})
				} 
			}
		})
    },
    
    /**
     * 分享
     * @param
     * @return
     */
    share(){
        this.selectComponent('#mdPopup').showPopup()
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
                this.selectComponent('#mdDialog').tip('图片已保存至相册')
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
			title: '运动记录',
			imageUrl: this.selectComponent('#mdPoster').getImgSrc(),
			path: `/pages/my/record/detail/sport/detail?id=${this.data.paramObj.id}&isShare=true&type=${this.data.paramObj.type}&markId=${this.data.paramObj.markId}`
		}
    }
})