// pages/strategy/strategy.js
import HiNavigator from "../../navigator/hi-navigator";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: [
            '请勿在饮酒后24小时内检测，女生使用需避开生理期；',
            '使用后请盖好保护盖，防止灰尘等细小异物； ',
            '请保持设备远离气味较大的物品，如：酒精、指甲油、香水和鲜花等，并远离潮湿环境。'
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    toHomePage:function (e) {
        HiNavigator.reLaunch({url:'/pages/index/index'});
    }
})