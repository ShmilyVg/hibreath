// pages/device-manage/device-manage.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";

Page({
    data: {
        deviceId: ''
    },

    onLoad: function (options) {
        console.log(options);
        this.setData({
            deviceId: options.deviceId
        })
    },
    unbindDevice() {
        Protocol.postDeviceUnbind({deviceId: this.data.deviceId}).then(data => {
            getApp().getBLEManager().closeAll();
            HiNavigator.reLaunch({url: '/pages/index/index'});
        }).catch(res => {
            console.log(res);
        })
    }
})
