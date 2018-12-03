// pages/device-bind/device-bind.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        result: {color: '#979797', text: '正在寻找您的设备\n请将设备开机并靠近手机'},

        failRemindList: [
            {text: '您的手机未开启蓝牙'},
            {text: '您的手机未授权微信获取定位权限'},
            {text: '您的设备正在被其他人使用'},
            {text: '您未在设备上短按按键确认绑定'},
        ]
    },

    state: {
        looking: {color: '#979797', text: '正在寻找您的设备\n请将设备开机并靠近手机'},
        found: {color: '#FE5E01', text: '已找到您的设备\n短按设备上的按键确认绑定'},
        failed: {color: '#979797', text: '绑定失败，请检查后重试'},
    },
    getResultState({state}) {
        return this.state[state];
    },
    showResult({state}) {
        this.setData({
            result: this.getResultState({state})
        })
    },

    reConnectEvent() {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.setBLEListener({
            bleStateListener: ({state}) => {

            },
            receiveDataListener: ({finalResult}) => {

            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
