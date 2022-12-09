const md_common = require('../../../utils/common.js')
const md_auth = require('../../../utils/authorize.js')
let coutTime
Page({
    data: {
        time: 3,
        isLogin: false,
        isShow: false,
        isClick: false,
        isPageHide: false
    },

    /**
     * 生命周期函数--监听页面加载
     * @param 
     * @return
     */
    onLoad: function () {
        this.initPage()
    },

    /**
     * 初始化页面
     * @param 
     * @return
     */
    initPage(){
        md_auth.checkToken({
            callbackFn:(e)=>{
                this.setData({
                    isShow: true,
                    isLogin: e.isToken
                },()=>{
                    if(this.data.time>0) {
                        coutTime = setInterval(()=>{
                            this.setData({
                                time: this.data.time-1
                            },()=>{
                                if(this.data.time==0) {
                                    clearInterval(coutTime)
                                    if(e.isToken) {
                                        wx.reLaunch({
                                            url: '/pages/mineslim/index/index'
                                        })
                                    } else {
                                        wx.reLaunch({
                                            url: `/pages/find/index/index`,
                                        })
                                    }
                                }
                            })
                        },1000)
                    } else {
                        if(e.isToken) {
                            wx.reLaunch({
                                url: '/pages/mineslim/index/index'
                            })
                        } else {
                            wx.reLaunch({
                                url: `/pages/find/index/index`,
                            })
                        }
                    }
                })
            },
            isGoLogin: false,
            isTip: false
        })
    },

    /**
     * 页面隐藏
     * @param 
     * @return
     */
    onHide() {
        this.setData({
            isPageHide: true
        },()=>{
            clearInterval(coutTime)
        })
    },

    /**
     * 页面展示
     * @param 
     * @return
     */
    onShow() {
        if(this.data.isPageHide) {
            this.setData({
                isPageHide: false
            },()=>{
                this.initPage()
            })
        }
    },

    /**
     * 页面跳转
     * @param 
     * @return
     */
    goPage() {
        if(this.data.isClick) {
            return
        }
        this.setData({
            isClick: true
        },()=>{
            clearTimeout(coutTime)
            if(this.data.isLogin) {
                wx.reLaunch({
                    url: '/pages/mineslim/index/index'
                })
            } else {
                wx.reLaunch({
                    url: `/pages/find/index/index`,
                })
            }
        })
    }
})