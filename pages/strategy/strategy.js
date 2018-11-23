// pages/strategy/strategy.js
import HiNavigator from "../../navigator/hi-navigator";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: [
            '请勿在饮酒后24小时以内检测。 ',
            '女生使用时需避开生理期。 ',
            '请保持设备远离如下常见物品：酒精，指甲油，香水，蜡烛，芳香食品和鲜花，也请远离浴室和厨房。',
            '使用后请盖好保护盖，防止灰尘等细小异物。'
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    toHomePage:function (e) {
        HiNavigator.redirectTo({url:'/pages/index/index'});
    }
})