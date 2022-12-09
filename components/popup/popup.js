Component({
    properties: {
        isRound: { //是否显示圆角 默认不显示
            type: Boolean,
            value: false
        },
        isOverlay: { //是否显示遮罩层 默认显示
            type: Boolean,
            value: true
        },
        isclose_on_click_overlay: { //是否在点击遮罩层后关闭 默认true
            type: Boolean,
            value: true
        },
        duration: { //动画时长 默认300ms
            type: Number,
            value: 300
        },
        position: { //单出位置可选值：top bottom right left
            type: String,
            value: 'bottom'
        },
        islock_scroll: {  //是否锁定背景滚动 默认true
            type: Boolean,
            value: true
        }
    },
    data: {
        animation: '',   //popup动画
        isShow: false,   //是否显示遮罩层
        animationStaus: 'stop'  //动画状态
    },
    /**
     * 自定义组件生命周期-组件挂载后执行
     * @param
     * @return
     */
    ready() {
        this.animation = wx.createAnimation({
            duration: this.data.duration,
            timingFunction: "linear",
            delay: 0
        })
    },
    methods: {
        /**
         * 点击遮罩层关闭遮罩层
         * @param
         * @return
         */
        clickBox() {
            if (this.data.isclose_on_click_overlay) {
                if(this.data.animationStaus == 'stop'){
                    this.hidePopup()
                }
            }
        },
        /**
         * 点击内容无动作
         * @param
         * @return
         */
        clickSlot(){

        },
        /**
         * 显示popup
         * @param 
         * @return
         */
        showPopup() {
            this.setData({
                isShow: true,
                animationStaus: 'runing'
            },()=>{
                setTimeout(()=> {
                    if(this.data.position == 'top' || this.data.position == 'bottom'){
                        this.animation.translateY('0%').step()
                    }else if(this.data.position == 'right' || this.data.position == 'left'){
                        this.animation.translateX('0%').step()
                    }
                    this.setData({
                        animation: this.animation.export()
                    })
                }, 20)
            })
            this.triggerEvent('open') //打开弹出层时触发
            setTimeout(() => {
                this.setData({
                    animationStaus: 'stop'
                })
                this.triggerEvent('opened') //打开弹出层且动画结束后触发
            }, this.data.duration + 20)
        },
        /**
         * 隐藏popup
         * @param 
         * @return
         */
        hidePopup() {
            this.setData({
                animationStaus: 'runing'
            })
            this.triggerEvent('close') //关闭弹出层时触发
            setTimeout(() => {
                this.setData({
                    isShow: false,
                    animationStaus: 'stop'
                })
                this.triggerEvent('closed') //关闭弹出层且动画结束后触发
            }, this.data.duration + 20)
            if(this.data.position == 'top'){
                this.animation.translateY('-100%').step()
            }else if(this.data.position == 'right'){
                this.animation.translateX('100%').step()
            }else if(this.data.position == 'bottom'){
                this.animation.translateY('100%').step()
            }else if(this.data.position == 'left'){
                this.animation.translateX('-100%').step()
            }
            this.setData({
                animation: this.animation.export()
            })
        }
    }
})