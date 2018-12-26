// pages/device-manage/device-manage.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {Toast} from "heheda-common-view";

Page({
    data: {
        deviceId: ''
    },

    onLoad() {
        Toast.showLoading();
        Protocol.getDeviceBindInfo().then(data => {
            const deviceInfo = data.result;
            this.setData({
                deviceId: deviceInfo.deviceId
            })
        }).finally(() => Toast.hiddenLoading());

    },
    unbindDevice() {
        Toast.showLoading();
        Protocol.postDeviceUnbind({deviceId: this.data.deviceId}).then(data => {
            getApp().getBLEManager().clearConnectedBLE();
            HiNavigator.reLaunch({url: '/pages/index/index'});
        }).catch(res => {
            console.log(res);
        }).finally(() => Toast.hiddenLoading());
    }
})
