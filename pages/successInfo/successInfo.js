/**
 * @Date: 2019-10-09 11:00:15
 * @LastEditors: 张浩玉
 */
import HiNavigator from "../../navigator/hi-navigator";
const app = getApp();
Page({

    data: {
        bindSuccessArr:[
            "若有饮酒请间隔24小时以上再进行检测",
            "吸烟、涂抹口红、喷香水等行为会对检测结果的准确性产生影响",
            "测试完毕后使用洁净柔软的干布或纸张轻轻擦拭干净吹气口。使用后请盖好保护盖，防止灰尘等细小异物"
        ],
        currentSwiper: 0,
        resultDelta:1,
        showText:false
    },

    onLoad: function () {
        if(app.globalData.hipeeScene == 'device' && !wx.getStorageSync('bind_first')){
            wx.setStorageSync('bind_first', 'ready')
            this.setData({
                showText:true
            })
        }
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#7BC877',
        })
    },
    onUnload: function () {
       /* HiNavigator.navigateIndex();*/
    },
    onShow:function () {
        
    },
    swiperChange: function (e) {
        this.setData({
            currentSwiper: e.detail.current
        })

    },
    toSetInfo(){
        HiNavigator.switchToSetInfo()
    },
    toIndex(){
        HiNavigator.navigateIndexSuc({data:true})
    },
    handlerGobackClick(){
        console.log('getCurrentPages()',getCurrentPages())
        let pages = getCurrentPages();
        for(var i = 0;i<pages.length;i++){
            if(pages[i].route ==='pages/result/result'){
                this.setData({
                    resultDelta:this.data.resultDelta+i
                })
                wx.navigateBack({
                    delta:pages.length-this.data.resultDelta
                })
                console.log('pages.length-this.data.resultDelta',pages.length-this.data.resultDelta)
                return;
            }
        }
        HiNavigator.switchToSetInfo()
    }

})
