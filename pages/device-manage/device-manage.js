// pages/device-manage/device-manage.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";

Page({
    data: {
        deviceId: '123'
    },

    onLoad: function (options) {
        this.setData({
            deviceId: options.deviceId
        })
    },
    unbindDevice() {
        Protocol.postDeviceUnbind(this.data.deviceId).then(data => {
            HiNavigator.reLaunch({url: '/pages/index/index'});
        })
    }
})