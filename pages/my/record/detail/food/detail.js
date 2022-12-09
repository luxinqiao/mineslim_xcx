const md_request = require('../../../../../utils/request.js')
const md_common = require('../../../../../utils/common.js')
const md_auth = require('../../../../../utils/authorize.js')

Page({
    data: {
        paramObj: {},
        dataObj: {},
        isFamily: false,
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
            paramObj: options,
            isFamily: options.name.indexOf('家庭')>-1 ?true: false
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
            path: md_request.config.yy + '/wechat/my/food-record-detail',
            data: {
                token: wx.getStorageSync('token'),	
                id: this.data.paramObj.id,
                mark_id: this.data.paramObj.markId
            },
            callback: res => {
                this.setData({
                    isReady: true
                })
                this.selectComponent('#mdDialog').close()
                if (res.data.code == '200') {
                    let data = res.data.data
                    data.target.map((item)=>{
                        if(!md_common.isEmpty(item.effect)) {
                            item.effect =  item.effect.replace(/[\r\n]/g,'')
                        }
                    })
                    this.setData({
                        dataObj: data
                    })
                } 
            }
      })
    },

    /**
     * 作用详情
     * @param 
     * @return
     */
    introdUse() {
        this.selectComponent('#mdPopup').showPopup()
    },

    
    /**
     * 分享
     * @param
     * @return
     */
    share(){
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
			title: '饮食记录',
			imageUrl: this.selectComponent('#mdPoster').getImgSrc(),
			path: `/pages/my/record/detail/food/detail?id=${this.data.paramObj.id}&isShare=true&name=${this.data.paramObj.name}&markId=${this.data.paramObj.markId}`
		}
    }
})