const md_request = require('../../../../../utils/request.js')
const md_common = require('../../../../../utils/common.js')
const md_auth = require('../../../../../utils/authorize.js')

Page({
    data: {
        paramObj: {},
        tabName: 'home',
        dataObj: {},
        isReady: false,
        isClock:false,

        isFamDraw: false,  //是否绘图-家庭
        isProDraw: false,  //是否绘图-专业
        familyDrawObj: {      //是否绘图-家庭
            isFirst: false,
            isSuccess: false
        },
        ProDrawObj: {      //是否绘图-家庭
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
        this.selectComponent('#mdDialog').loading()
        this.setData({
            paramObj: options,
            tabName: md_common.isEmpty(options.tabName)?'home': options.tabName
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
        let dataObj = {
            token: wx.getStorageSync('token')
        }
        if(!md_common.isEmpty(this.data.paramObj.id)) {
            dataObj.record_id = this.data.paramObj.id
        }
		md_request.api({
			path: md_request.config.yy + '/wechat/health/sport',
			data: dataObj,
			callback: res => {
                this.setData({
                    isReady: true
                })
                this.selectComponent('#mdDialog').close()
				if (res.data.code == '200') {
                    let data = res.data.data
                    if(md_common.isEmpty(data.family.scheme)&&!md_common.isEmpty(data.pro.scheme)) {
                        this.setData({
                            tabName: 'major'
                        })
                    }
					this.setData({
                        dataObj: res.data.data,
                        isClock: false
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
     * 打卡
     * @param {dom} e 打卡
     * @return
     */
    clock(e) {
        if(this.data.isClock) {
            return
        }
        this.setData({
            isClock: true
        })
        let type = e.currentTarget.dataset.type
        if(type == 1 && this.data.dataObj.family.can_mark!=1) {
            this.selectComponent('#mdDialog').tip('每天打卡次数不能超过3次哦')
            this.setData({
                isClock: false
            })
            return
        } else if(type == 2 && this.data.dataObj.pro.can_mark!=1) {
            this.selectComponent('#mdDialog').tip('每天打卡次数不能超过3次哦')
            this.setData({
                isClock: false
            })
            return
        }
        md_request.api({
            path: md_request.config.yy + '/wechat/health/sport-mark',
            data: {
                token: wx.getStorageSync('token'),
                type: type
            },
            callback: res => {
                if (res.data.code == '200') {
                    this.selectComponent('#mdDialog').alert('运动打卡已成功！','确认',()=>{
                        this.initData()
                    })
                } else if (res.data.code == '210'){
                    this.selectComponent('#mdDialog').tip(res.data.note)
                    this.initData()
                } else {
                    this.selectComponent('#mdDialog').tip(res.data.note)
                    this.setData({
                        isClock: false
                    })
                } 
            }
        })
    },

    /**
     * 分享
     * @param {dom} e 分享
     * @return
     */
    share(e){
        let type = e.currentTarget.dataset.type
        if(type == 'family') {
            this.selectComponent('#mdPopupFam').showPopup()
            if(!this.data.familyDrawObj.isSuccess) {
                this.selectComponent('#mdDialogFam').load()
            }
            if(!this.data.familyDrawObj.isFirst) {
                this.setData({
                    'familyDrawObj.isFirst': true
                },()=>{
                    this.selectComponent('#mdPosterFam').beginDraw({
                        successFun: ()=> {
                            this.setData({
                                'familyDrawObj.isSuccess': true
                            },()=>{
                                this.selectComponent('#mdDialogFam').close()
                            })
                        }
                    })
                })
            }
        } else {
            this.selectComponent('#mdPopupPro').showPopup()
            if(!this.data.ProDrawObj.isSuccess) {
                this.selectComponent('#mdDialogPro').load()
            }
            if(!this.data.ProDrawObj.isFirst) {
                this.setData({
                    'ProDrawObj.isFirst': true
                },()=>{
                    this.selectComponent('#mdPosterPro').beginDraw({
                        successFun: ()=> {
                            this.setData({
                                'ProDrawObj.isSuccess': true
                            },()=>{
                                this.selectComponent('#mdDialogPro').close()
                            })
                        }
                    })
                })
            }
        }
    },

    /**
     * 保存本地
     * @param {e} 专业/家庭保存本地
     * @return
     */
    save(e) {
        let type = e.currentTarget.dataset.type
        let src = ''
        if(type == 'family') {
            src = this.selectComponent('#mdPosterFam').getImgSrc()
        } else {
            src = this.selectComponent('#mdPosterPro').getImgSrc()
        }
        md_auth.saveToAlbum({
            filePath: src,
            successCallback: ()=>{
                this.selectComponent('#mdDialog').tip('图片已保存至相册')
            }
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     * @param 
     * @return
     */
    onPullDownRefresh() {

    },

    /**
     * 用户点击右上角分享
     * @param 
     * @return
     */
    onShareAppMessage() {
        let src = ''
        let path = ''
        if(this.data.tabName == 'home') {
            src =  this.selectComponent('#mdPosterFam').getImgSrc()
            path = `/pages/mineslim/health/sport/index/index?id=${this.data.dataObj.record_id}&tabName=home&isShare=true`
        } else {
            src =  this.selectComponent('#mdPosterPro').getImgSrc()
            path = `/pages/mineslim/health/sport/index/index?id=${this.data.dataObj.record_id}&tabName=major&isShare=true`
        }
        return {
			title: '动起来更精彩',
			imageUrl: src,
			path: path
		}
    }
})