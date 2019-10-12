// pages/device-manage/device-manage.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {Toast} from "heheda-common-view";

Page({
    data: {
        deviceId: '',
        isBind:""
    },

    onLoad() {
        Toast.showLoading();
        Protocol.getDeviceBindInfo().then(data => {
            const deviceInfo = data.result;
            if(data.result == null){
                this.setData({
                    isBind:false
                })
            }else{
                this.setData({
                    deviceId: deviceInfo.deviceId,
                    isBind:true
                })
            }

        }).finally(() => Toast.hiddenLoading());

    },
    unbindDevice() {
        Toast.showLoading();
        Protocol.postDeviceUnbind({deviceId: this.data.deviceId}).then(data => {
            getApp().getBLEManager().clearConnectedBLE().finally(() => {
              /*  HiNavigator.reLaunch({url: '/pages/index/index'});*/
                Toast.success('解绑成功');
                wx.navigateBack({
                    delta: 1
                });
            });
        }).catch(res => {
            console.log('解绑失败', res);
        }).finally(() => Toast.hiddenLoading());
    },
    toBind(){
        HiNavigator.navigateToBind()
    }
})
