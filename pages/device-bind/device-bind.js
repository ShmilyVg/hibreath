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
            {text: '手机未开启蓝牙'},
            {text: '手机未授权微信获取定位权限'},
            {text: '燃脂精灵离手机太远'},
            {text: '未在燃脂精灵上短按按键确认'},
            {text: '燃脂精灵正处于检测状态'},
        ],
        homeHeartBox: ["home-heartbox-white",".home-heartbox-orange",".home-heartbox-orange-animation"],
        homeP:[
            "1. 手机未开启蓝牙",
            "2. 手机未授权微信获取定位权限",
            "3. 燃脂精灵离手机太远",
            "4. 未在燃脂精灵上短按按键确认",
            "5. 燃脂精灵正处于检测状态"
        ],
        bindHintShow: false,
    },
    isBind: false,

    getResultState({state}) {
        switch (state) {
            case ConnectState.CONNECTING:
                this.indexCommonManager.setSearchingState();
                this.setData({
                    bindHintShow: true,
                    bindHint:"请将设备开机并靠近手机",
                });
                break;
            case ConnectState.UNAVAILABLE:
            case ConnectState.DISCONNECT:
            case ConnectState.UNBIND:
                this.isBind = false;
                app.getBLEManager().clearConnectedBLE();
                this.indexCommonManager.setDissearchState();
                this.setData({
                    bindHintShow: false,
                    bindHint:"",
                });
                break;
            default:
                this.indexCommonManager.setSearchedState();
                this.setData({
                    bindHintShow: true,
                    bindHint:"短按设备上的按键确认绑定",
                });
                break;
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
                if (state.protocolState === ProtocolState.CONNECTED_AND_BIND) {
                    this.isBind = true;
                    //绑定后 跳转绑定成功页面  点击按钮再进入index页面
                    //setTimeout(() => HiNavigator.navigateSuccessInfo());
                    const pages = getCurrentPages()
                    const prevPage = pages[pages.length-2]
                    prevPage.setData({
                        isBind:  this.isBind
                    })
                    setTimeout(() => HiNavigator.navigateBack({delta: 1}));
                }else{
                    this.showResult({state: state.connectState});
                }
            },
            receiveDataListener: ({finalResult, state}) => {
                // if (ProtocolState.GET_CONNECTED_RESULT_SUCCESS === state.protocolState) {
                //     this.isBind = true;
                //     const {isConnected} = finalResult;
                //     const bleManager = app.getBLEManager();
                //     bleManager.updateBLEStateImmediately(
                //         bleManager.getState({
                //             connectState: ConnectState.CONNECTED,
                //             protocolState: ProtocolState.CONNECTED_AND_BIND
                //         })
                //     );
                //     isConnected && HiNavigator.navigateBack({delta: 1});
                // }
            }
        });
        //是否需要升级 标志位
        //getApp().needCheckOTAUpdate = true;
       /* HiNavigator.navigateSuccessInfo();*/
    },

    onShow() {
        app.getBLEManager().connect();
    },

    onUnload() {
        !this.isBind && app.getBLEManager().clearConnectedBLE();
    }
});
