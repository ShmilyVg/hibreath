// pages/device-manage/device-manage.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {Toast, WXDialog} from "heheda-common-view";
var mta= require('../../utils//mta_analysis.js')
Page({
    data: {
        deviceId: '',
        isBind:""
    },

    onLoad() {

    },
    onShow(){
      Toast.showLoading();
      Protocol.getDeviceBindInfo().then(data => {
        this.setData({
          ...data.result
        })
        if(!this.data.mac){
          this.setData({
            isBind:false
          })
        }else{
          this.setData({
            deviceId: this.data.deviceId,
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
      wx.getSystemInfo({
        success (res) {
          console.log('locationEnabled',res.locationEnabled,res.bluetoothEnabled)
          if(res.locationEnabled && res.bluetoothEnabled && res.locationAuthorized){
            HiNavigator.navigateToDeviceBind()
            return
          }else if(!res.bluetoothEnabled){
            setTimeout(() => {
              WXDialog.showDialog({title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
            },200);
            return
          }else if(!res.locationEnabled){
            setTimeout(() => {
              WXDialog.showDialog({title: '小贴士', content: '请开启手机GPS/位置', confirmText: '我知道了'});
            },200);
            return
          }else if(!res.locationAuthorized){
            setTimeout(() => {
              wx.showModal({
                title: '小贴士',
                content: '前往手机【设置】->找到【微信】应用\n' +
                  '\n' +
                  '打开【微信定位/位置权限】',
                showCancel: false,
                confirmText: '我知道了',
              })
            },200);
            return
          }
        }
      })
    }
})
