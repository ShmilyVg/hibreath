// pages/device-bind/device-bind.js
import {ConnectState, ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import HiNavigator from "../../navigator/hi-navigator";
import IndexCommonManager from "../index/view/indexCommon";

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
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
                this.indexCommonManager.setSearchingState();
                break;
            case ConnectState.UNAVAILABLE:
            case ConnectState.DISCONNECT:
            case ConnectState.UNBIND:
                this.isBind = false;
                app.getBLEManager().clearConnectedBLE();
                return {
                    burnupShow: true,

                    picState: true,
                    btnState: false,
                    picStateUrl: '../../images/index/search.png',
                    homeHeartBoxIndex: 1,

                    homeTitle: true,
                    homeTitleText: "绑定失败，请检查后重试",
                    homePShow: false,
                    homeOrangeBtn: false,


                };
            default:
                return {

                    burnupShow: true,

                    picState: true,
                    btnState: false,
                    picStateUrl: '../../images/index/search.png',
                    homeHeartBoxIndex: 1,

                    homeTitle: true,
                    homeTitleText: "已找到您的设备\n短按设备上的按键确认绑定",
                    homePShow: false,
                    homeOrangeBtn: false,

                };
        }
    },

    showResult({state}) {
        this.getResultState({state});
    },

    reConnectEvent() {
        app.getBLEManager().connect();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
       this.indexCommonManager = new IndexCommonManager(this);
        app.setBLEListener({
            bleStateListener: ({state}) => {
                this.showResult({state: state.connectState});
            },
            receiveDataListener: ({finalResult, state}) => {
                if (ProtocolState.GET_CONNECTED_RESULT_SUCCESS === state.protocolState) {
                    this.isBind = true;
                    const {isConnected} = finalResult;
                    const bleManager = app.getBLEManager();
                    bleManager.updateBLEStateImmediately(
                        bleManager.getState({
                            connectState: ConnectState.CONNECTED,
                            protocolState: ProtocolState.CONNECTED_AND_BIND
                        })
                    );
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
