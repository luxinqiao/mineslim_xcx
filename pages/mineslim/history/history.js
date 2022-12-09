const md_request = require('../../../utils/request.js')
const md_common = require('../../../utils/common.js')
const md_dict = require('../../../utils/dict.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabName: 'week',
        canvasW: 690,
        canvasH: 590,

        oneWeekObj: {
            weightObj: {
                isDraw: false,
                dataObj:{}
            },
            bmiObj: {
                isDraw: false,
                dataObj:{}
            },
            fatObj: {
                isDraw: false,
                dataObj:{}
            },
            muscleObj: {
                isDraw: false,
                dataObj:{}
            }
        },
        oneMonObj: {
            weightObj: {
                isDraw: false,
                dataObj:{}
            },
            bmiObj: {
                isDraw: false,
                dataObj:{}
            },
            fatObj: {
                isDraw: false,
                dataObj:{}
            },
            muscleObj: {
                isDraw: false,
                dataObj:{}
            }
        },
        threeMonObj: {
            weightObj: {
                isDraw: false,
                dataObj:{}
            },
            bmiObj: {
                isDraw: false,
                dataObj:{}
            },
            fatObj: {
                isDraw: false,
                dataObj:{}
            },
            muscleObj: {
                isDraw: false,
                dataObj:{}
            }
        },
        adviceArr: []
    },

    /**
     * 生命周期函数--监听页面加载
     * @param 
     * @return
     */
    onLoad() {
        for(let i = 1;i<13;i++) {
            this.selectComponent('#mdDialog'+i).load()
        }
        this.initData(md_dict.timeType.WEEK,'weight')
        this.initData(md_dict.timeType.WEEK,'bmi')
        this.initData(md_dict.timeType.WEEK,'body_fat_rate')
        this.initData(md_dict.timeType.WEEK,'muscle')
        this.initAdvice()
    },

    /**
     * 初始化数据
     * @param {string} type 时间：1-近一周、2-近一月、3-近三月
     * @param {string} field 类型：weight/bmi/body_fat_rate/muscle
     * @return
     */
	initData(type,field){
		md_request.api({
			path: md_request.config.yy + '/wechat/target/history',
			data: {
                token: wx.getStorageSync('token'),
                time_type: type,
                field: field
			},
			isTourist: true,
			callback: res => {
				if (res.data.code == '200') {
                    let data = res.data.data
					if(type == 1) {
                        if(field == 'weight') {
                            this.setData({
                                'oneWeekObj.weightObj.dataObj': data
                            },()=>{
                                if(!this.data.oneWeekObj.weightObj.isDraw) {
                                    this.selectComponent('#mdLineChartWW').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'oneWeekObj.weightObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog1').close()
                                        }
                                    })
                                }
                            })
                        } else if(field == 'bmi') {
                            this.setData({
                                'oneWeekObj.bmiObj.dataObj': data
                            },()=>{
                                if(!this.data.oneWeekObj.bmiObj.isDraw) {
                                    this.selectComponent('#mdLineChartWB').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'oneWeekObj.bmiObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog2').close()
                                        }
                                    })
                                }
                            })
                        } else if(field == 'body_fat_rate') {
                            this.setData({
                                'oneWeekObj.fatObj.dataObj': data
                            },()=>{
                                if(!this.data.oneWeekObj.fatObj.isDraw) {
                                    this.selectComponent('#mdLineChartWF').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'oneWeekObj.fatObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog3').close()
                                        }
                                    })
                                }
                            })
                        } else if(field == 'muscle') {
                            this.setData({
                                'oneWeekObj.muscleObj.dataObj': data
                            },()=>{
                                if(!this.data.oneWeekObj.muscleObj.isDraw) {
                                    this.selectComponent('#mdLineChartWM').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'oneWeekObj.muscleObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog4').close()
                                        }
                                    })
                                }
                            })
                        }
                    } else if(type == 2) {
                        let x=[]
                        data.xData.map((item,index)=>{
                            if(index%4==0) {
                                x.push(item)
                            }
                            if(index == data. xData.length-1) {
                                x.push(item)
                            }
                        })
                        data.xData = x
                        if(field == 'weight') {
                            this.setData({
                                'oneMonObj.weightObj.dataObj': data
                            },()=>{
                                if(!this.data.oneMonObj.weightObj.isDraw) {
                                    this.selectComponent('#mdLineChartOW').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'oneMonObj.weightObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog5').close()
                                        }
                                    })
                                }
                            })
                        } else if(field == 'bmi') {
                            this.setData({
                                'oneMonObj.bmiObj.dataObj': data
                            },()=>{
                                if(!this.data.oneMonObj.bmiObj.isDraw) {
                                    this.selectComponent('#mdLineChartOB').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'oneMonObj.bmiObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog6').close()
                                        }
                                    })
                                }
                            })
                        } else if(field == 'body_fat_rate') {
                            this.setData({
                                'oneMonObj.fatObj.dataObj': data
                            },()=>{
                                if(!this.data.oneMonObj.fatObj.isDraw) {
                                    this.selectComponent('#mdLineChartOF').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'oneMonObj.fatObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog7').close()
                                        }
                                    })
                                }
                            })
                        } else if(field == 'muscle') {
                            this.setData({
                                'oneMonObj.muscleObj.dataObj': data
                            },()=>{
                                if(!this.data.oneMonObj.muscleObj.isDraw) {
                                    this.selectComponent('#mdLineChartOM').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'oneMonObj.muscleObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog8').close()
                                        }
                                    })
                                }
                            })
                        }
                    } else if(type == 3) {
                        let x=[]
                        data.xData.map((item,index)=>{
                            if(index%13==0) {
                                x.push(item)
                            }
                            if(index == data. xData.length-1) {
                                x.push(item)
                            }
                        })
                        data.xData = x
                        if(field == 'weight') {
                            this.setData({
                                'threeMonObj.weightObj.dataObj': data
                            },()=>{
                                if(!this.data.threeMonObj.weightObj.isDraw) {
                                    this.selectComponent('#mdLineChartTW').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'threeMonObj.weightObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog9').close()
                                        }
                                    })
                                }
                            })
                        } else if(field == 'bmi') {
                            this.setData({
                                'threeMonObj.bmiObj.dataObj': data
                            },()=>{
                                if(!this.data.threeMonObj.bmiObj.isDraw) {
                                    this.selectComponent('#mdLineChartTB').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'threeMonObj.bmiObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog10').close()
                                        }
                                    })
                                }
                            })
                        } else if(field == 'body_fat_rate') {
                            this.setData({
                                'threeMonObj.fatObj.dataObj': data
                            },()=>{
                                if(!this.data.threeMonObj.fatObj.isDraw) {
                                    this.selectComponent('#mdLineChartTF').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'threeMonObj.fatObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog11').close()
                                        }
                                    })
                                }
                            })
                        } else if(field == 'muscle') {
                            this.setData({
                                'threeMonObj.muscleObj.dataObj': data
                            },()=>{
                                if(!this.data.threeMonObj.muscleObj.isDraw) {
                                    this.selectComponent('#mdLineChartTM').beginDraw({ 
                                        successFun: ()=> {
                                            this.setData({
                                                'threeMonObj.muscleObj.isDraw': true
                                            })
                                            this.selectComponent('#mdDialog12').close()
                                        }
                                    })
                                }
                            })
                        }
                    } 
                    
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
			},()=>{
                if(name == 'month') {
                    this.initData(md_dict.timeType.MONTH,'weight')
                    this.initData(md_dict.timeType.MONTH,'bmi')
                    this.initData(md_dict.timeType.MONTH,'body_fat_rate')
                    this.initData(md_dict.timeType.MONTH,'muscle')
                } else if(name == 'season') {
                    this.initData(md_dict.timeType.SEASON,'weight')
                    this.initData(md_dict.timeType.SEASON,'bmi')
                    this.initData(md_dict.timeType.SEASON,'body_fat_rate')
                    this.initData(md_dict.timeType.SEASON,'muscle')
                }
            })
        }
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0
            })
          }
    },
    
    /**
     * 初始化建议
     * @param
     * @return
     */
	initAdvice(){
		md_request.api({
			path: md_request.config.yy + '/wechat/target/stage-advice',
			data: {
                token: wx.getStorageSync('token')
            },
			callback: res => {
				if (res.data.code == '200') {
					this.setData({
						adviceArr: res.data.data
					})
				} 
			}
		})
	}
})