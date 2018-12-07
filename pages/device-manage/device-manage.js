// pages/device-manage/device-manage.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";

Page({
    data: {
        deviceId: ''
    },

    onLoad() {
        Protocol.getDeviceBindList().then(data => {
            const list = data.result;
            this.setData({
                deviceId: list[0]
            })
        })

    },
    unbindDevice() {
        Protocol.postDeviceUnbind({deviceId: this.data.deviceId}).then(data => {
            getApp().getBLEManager().clearConnectedBLE();
            HiNavigator.reLaunch({url: '/pages/index/index'});
        }).catch(res => {
            console.log(res);
        })
    }
})
