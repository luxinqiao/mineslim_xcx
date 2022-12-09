const md_common = require('../../../utils/common.js')
const md_upImg = require('../../../utils/uploadImg.js')
const md_request = require('../../../utils/request.js')

Page({
	data: {
        dataObj: {},
        isReady: false,
        imgObj: {
            isChange: false,
            isUpload: false
        },
        zoneObj: {
            selectText: '',
            nameDataArr: [],  //处理后用于展示的地址
            indexArr: [0, 0, 0],
            dataArr:[],
            codeObj: {}
        },
        isSave: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 * @param 
     * @return
	 */
	onLoad() {
        this.initData()
    },

    /**
	 * 生命周期函数--监听页面显示
	 * @param 
     * @return
	 */
    onShow() {
        if(this.data.isSave) {
            this.setData({
                isSave: false
            })
        }
    },
    
     /**
     * 初始化数据
     * @param 
     * @return
     */
    initData() {
        md_request.api({
			path: md_request.config.yy + '/wechat/my/information',
			data: {
				token: wx.getStorageSync('token')
            },
			callback: res => {
				if (res.data.code == '200') {
					this.setData({
                        dataObj: res.data.data,
                        isReady: true
					},()=>{
                        this.initProvince()
                    })
				} else {
                    this.selectComponent('#mdDialog').tip(res.data.note)
                }
			}
		})
    },

    /**
     * 初始化省
     * @param
     * @return
     */
    initProvince: function () {
        md_request.api({
            path: md_request.config.yy + '/wechat/district/list',
            data: {},
            callback: (res) => {
                if (res.data.code == 200) {
                    this.setData({
                        'zoneObj.dataArr[0]': res.data.data,
                        'zoneObj.dataArr[1]': [],
                        'zoneObj.dataArr[2]': [],
                        'zoneObj.nameDataArr[0]': this.convertNameArr(res.data.data),
                        'zoneObj.nameDataArr[1]': [],
                        'zoneObj.nameDataArr[2]': []
                    })
                    if (res.data.data.length > 0) {
                        this.initCity(res.data.data[0].code)
                    }
                }
            }
        })
    },
    /**
     * 初始化市
     * @param {String} provinceCode 省编码
     * @return
     */
    initCity: function (provinceCode) {
        md_request.api({
            path: md_request.config.yy + '/wechat/district/list',
            data: {
                code: provinceCode
            },
            callback: (res) => {
                if (res.data.code == 200) {
                    this.setData({
                        'zoneObj.dataArr[1]': res.data.data,
                        'zoneObj.dataArr[2]': [],
                        'zoneObj.nameDataArr[1]': this.convertNameArr(res.data.data),
                        'zoneObj.nameDataArr[2]': []
                    })
                    if (res.data.data.length > 0) {
                        this.initArea(res.data.data[0].code)
                    }
                }
            }
        })
    },

    /**
     * 初始化区
     * @param {String} cityCode 市编码
     * @return
     */
    initArea: function (cityCode) {
        md_request.api({
            path: md_request.config.yy + '/wechat/district/list',
            data: {
                code: cityCode
            },
            callback: (res) => {
                if (res.data.code == 200) {
                    this.setData({
                        'zoneObj.dataArr[2]': res.data.data,
                        'zoneObj.nameDataArr[2]': this.convertNameArr(res.data.data)
                    })
                }
            }
        })
    },
    /**
     * 抽离出名称数组
     * @param {Array} arr 全数据数组
     * @return {Array} 名称数组
     */
    convertNameArr: function (arr) {
        let nameArr = []
        for (let i = 0; i < arr.length; i++) {
            nameArr.push(arr[i].name)
        }
        return nameArr
    },

    /**
     * 省市区切换
     * @param {Dom} e 所在地区
     * @return
     */
    zoneChange: function (e) {
        const col = e.detail.column, row = e.detail.value
        if (col == 0) {
            this.setData({
                'zoneObj.indexArr[0]': row,
                'zoneObj.indexArr[1]': 0,
                'zoneObj.indexArr[2]': 0
            })
            this.initCity(this.data.zoneObj.dataArr[0][row].code)
        } else if (col == 1) {
            this.setData({
                'zoneObj.indexArr[1]': row,
                'zoneObj.indexArr[2]': 0
            })
            this.initArea(this.data.zoneObj.dataArr[1][row].code)
        } else if (col == 2) {
            this.setData({
                'zoneObj.indexArr[2]': row
            })
        }
    },
    /**
     * 省市区确定
     * @param {Dom} e 所在地区
     * @return
     */
    zoneConfirm: function (e) {
        let zone = ''
        let codeObj ={}
        const provinceObj = this.data.zoneObj.dataArr[0][this.data.zoneObj.indexArr[0]]
        const cityObj = this.data.zoneObj.dataArr[1][this.data.zoneObj.indexArr[1]]
        const areaObj = this.data.zoneObj.dataArr[2][this.data.zoneObj.indexArr[2]]

        if(!md_common.isEmpty(areaObj)&&areaObj.name!='市辖区') {
            zone = areaObj.name
            codeObj.area_code = areaObj.code
        } else if(!md_common.isEmpty(cityObj)&&cityObj.name!='市辖区') {
            zone = cityObj.name
            codeObj.city_code = cityObj.code
        } else if(!md_common.isEmpty(provinceObj)) {
            zone = provinceObj.name
            codeObj.province_code = provinceObj.code
        }
        this.setData({
            'dataObj.address': zone,
            'zoneObj.codeObj': codeObj
        })
    },

	/**
     * 修改头像
     * @param 
     * @return
     */
    changeImg() {
        if(this.data.isSave) {
            return
        }
        this.setData({
            'imgObj.isChange': true
        },()=>{
            md_upImg.uploadImg({
                num: 1, 
                successCallback:(res) => {
                    this.setData({
                        'dataObj.avatar': res[0].url,
                        'imgObj.isUpload': true
                    },()=>{
                        
                    })
                }
            })
        })
    },

	/**
     * 修改昵称
     * @param {dom} e 昵称
     * @return
     */
	changeNickName: function (e) {
		let value = md_common.trimStr(e.detail.value)
		value = value.replace(/([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g,'')
        this.setData({
            'dataObj.name': value
        })
    },

	/**
     * 修改简介
     * @param {dom} e 简介
     * @return
     */
	changeSign(e) {
		this.setData({
            'dataObj.introduce': md_common.trimStr(e.detail.value)
        })
    },
    
    /**
     * 提交
     * @param 
     * @return
     */
    save() {
        if(this.data.isSave) {
            return
        }
        this.setData({
            isSave: true
        })
        let paramObj = {
            token: wx.getStorageSync('token'),
        }
        if(this.data.imgObj.isChange) {
            if(!this.data.imgObj.isUpload) {
                return
            } 
            paramObj.avatar = this.data.dataObj.avatar
        } else {
            if(!md_common.isEmpty(this.data.dataObj.avatar)) {
                paramObj.avatar = this.data.dataObj.avatar
            }
        }
        paramObj.name = this.data.dataObj.name
        if(!md_common.isEmpty(this.data.zoneObj.codeObj.province_code)) {
            paramObj.province_code = this.data.zoneObj.codeObj.province_code
        }
        if(!md_common.isEmpty(this.data.zoneObj.codeObj.city_code)) {
            paramObj.city_code = this.data.zoneObj.codeObj.city_code
        }
        if(!md_common.isEmpty(this.data.zoneObj.codeObj.area_code)) {
            paramObj.area_code = this.data.zoneObj.codeObj.area_code
        }
        paramObj.introduce = this.data.dataObj.introduce
        md_request.api({
            path: md_request.config.yy + '/wechat/my/edit-info',
            data: paramObj,
            callback: (res) => {
                if (res.data.code == 200) {
                    this.selectComponent('#mdDialog').coverTip('修改成功',()=>{
                        this.setData({
                            isSave: false
                        })
                        if(md_common.getCurrPage().route=='pages/my/info/info') {
                            md_common.refreshPrePage()
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    })
                } else {
                    this.setData({
                        isSave: false
                    },()=>{
                        this.selectComponent('#mdDialog').tip(res.data.note)
                    })
                }
            }
        })
    },

    /**
     * 页面销毁
     * @param
     * @return
     */
    onUnload() {
        this.selectComponent('#mdDialog').close()
    },
})