/**
 * @Date: 2019-10-09 11:00:15
 * @LastEditors: 张浩玉
 */
import HiNavigator from "../../navigator/hi-navigator";

Page({

    data: {
        bindSuccessArr:[
            "若有饮酒请间隔24小时以上再进行检测",
            "吸烟、涂抹口红、喷香水等行为会对检测结果的准确性产生影响",
            "测试完毕后使用洁净柔软的干布或纸张轻轻擦拭干净吹气口。使用后请盖好保护盖，防止灰尘等细小异物"
        ],
        currentSwiper: 0,
    },

    onLoad: function () {
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#EE6F69',
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
    toIndex(){
        HiNavigator.navigateIndexSuc({data:true})
    }

})
