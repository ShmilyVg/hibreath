// pages/device-bind/device-bind.js
import {ConnectState, ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import HiNavigator from "../../navigator/hi-navigator";

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
        ],
    },
    isBind: false,

    getResultState({state}) {
        switch (state) {
            case ConnectState.CONNECTING:
                return {
                    color: '#979797',
                    text: '正在寻找您的设备\n请将设备开机并靠近手机',
                    picPath: '../../images/device-bind/connecting.png'
                };
            case ConnectState.UNAVAILABLE:
            case ConnectState.DISCONNECT:
            case ConnectState.UNBIND:
                this.isBind = false;
                app.getBLEManager().clearConnectedBLE();
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
            showReConnected: state === ConnectState.DISCONNECT || state === ConnectState.UNAVAILABLE
        });
    },

    reConnectEvent() {
        app.getBLEManager().connect();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        app.setBLEListener({
            bleStateListener: ({state}) => {
                this.showResult({state});
            },
            receiveDataListener: ({finalResult, state}) => {
                if (ProtocolState.GET_CONNECTED_RESULT_SUCCESS === state) {
                    this.isBind = true;
                    const {isConnected} = finalResult;
                    app.getBLEManager().updateBLEStateImmediately({state: ProtocolState.CONNECTED_AND_BIND});
                    isConnected && HiNavigator.navigateBack({delta: 1});
                }
            }
        });
    },

    onShow() {
        app.getBLEManager().connect();
    },

    onUnload() {
        !this.isBind && app.getBLEManager().clearConnectedBLE();
    }
});
