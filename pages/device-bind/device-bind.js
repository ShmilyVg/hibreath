// pages/device-bind/device-bind.js
import BlueToothState from "../../modules/bluetooth/state-const";

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showReConnected: false,
        result: {},
        failRemindList: [
            {text: '您的手机未开启蓝牙'},
            {text: '您的手机未授权微信获取定位权限'},
            {text: '您的设备正在被其他人使用'},
            {text: '您未在设备上短按按键确认绑定'},
        ]
    },

    getResultState({state}) {
        switch (state) {
            case BlueToothState.CONNECTING:
                return {
                    color: '#979797',
                    text: '正在寻找您的设备\n请将设备开机并靠近手机',
                    picPath: '../../images/device-bind/connecting.png'
                };
            case BlueToothState.UNAVAILABLE:
            case BlueToothState.DISCONNECT:
                return {
                    color: '#979797',
                    text: '绑定失败，请检查后重试',
                    picPath: '../../images/device-bind/fail.png'
                };
            default:
                return {
                    color: '#FE5E01',
                    text: '已找到您的设备\n短按设备上的按键确认绑定',
                    picPath: '../../images/device-bind/connected.png'
                };
        }
    },

    showResult({state}) {
        this.setData({
            result: this.getResultState({state}),
            showReConnected: state === BlueToothState.DISCONNECT || state === BlueToothState.UNAVAILABLE
        });
    },

    reConnectEvent() {
        app.getBLEManager().connect();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // this.init();
        app.setBLEListener({
            bleStateListener: ({state}) => {
                this.showResult({state});
            }
        });
    },

    onShow() {
        app.getBLEManager().connect();
    }
    // init() {
    //     this.state = {};
    //     this.state[BlueToothState.CONNECTING] = {
    //         color: '#979797',
    //         text: '正在寻找您的设备\n请将设备开机并靠近手机',
    //         picPath: '../../images/device-bind/connecting.png'
    //     };
    //     this.state[BlueToothState.CONNECTED] = {
    //         color: '#FE5E01',
    //         text: '已找到您的设备\n短按设备上的按键确认绑定',
    //         picPath: '../../images/device-bind/connected.png'
    //     };
    //     this.state[BlueToothState.DISCONNECT] = this.state[BlueToothState.UNAVAILABLE] = this.state[BlueToothState.UNKNOWN] = {
    //         color: '#979797',
    //         text: '绑定失败，请检查后重试',
    //         picPath: '../../images/device-bind/fail.png'
    //     };
    // },
});
