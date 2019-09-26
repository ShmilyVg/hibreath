// pages/device-bind/device-bind.js
/**
 * @Date: 2019-09-25 15:36:52
 * @LastEditors: 张浩玉
 */
import {ConnectState, ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import HiNavigator from "../../navigator/hi-navigator";
import IndexCommonManager from "../index/view/indexCommon";
import WXDialog from "../../view/dialog";
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        homeP:[
            "1. 手机未开启蓝牙",
            "2. 手机未授权微信获取定位权限",
            "3. 燃脂精灵离手机太远",
            "4. 未在燃脂精灵上短按按键确认",
            "5. 燃脂精灵正处于检测状态"
        ],

    },
    isBind: false,

    getResultState({state}) {
        switch (state) {
            /*连接中*/
            case ConnectState.CONNECTING:
                wx.setNavigationBarColor({
                    frontColor: '#000000',
                    backgroundColor: '#fff',
                })
                this.indexCommonManager.setSearchingState();
                this.setData({
                    bgColor:"#fff",
                    finding:true,//正在寻找设备标志位
                    finded:false,//找到并绑定
                    noBind:false,
                    contentStateB:"正在寻找您的设备",
                    contentStateS:"长按设备按键·3秒开机",
                });
                break;
            /* UNAVAILABLE 蓝牙适配器不可用，通常是没有在手机设置中开启蓝牙，或是没有直接或间接调用父类中的openAdapter()*/
            /* DISCONNECT 蓝牙断开*/
            /*蓝牙未绑定*/
            case ConnectState.UNAVAILABLE:
            case ConnectState.DISCONNECT:
            case ConnectState.UNBIND:
                this.isBind = false;
                app.getBLEManager().clearConnectedBLE();
                this.indexCommonManager.setDissearchState();
                this.setData({
                    bgColor:"#EE6F69",
                    finding:false,
                    finded:false,
                    bindHint:"",
                });
                break;
            default:
                this.indexCommonManager.setSearchedState();
                this.setData({
                    bgColor:"#fff",
                    finding:false,
                    finded:true,
                    contentStateB:"燃脂精灵已经找到",
                    contentStateS:"短按设备按键·确认绑定",
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
    showTips(){
        WXDialog.showDialog({title: '小贴士', content:"请前往手机「设置」 找到「微信」 应用，打开「微信定位/位置权限」", confirmText: '我知道了'});
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
       this.indexCommonManager = new IndexCommonManager(this);
        app.setBLEListener({
            bleStateListener: ({state}) => {
                if (state.protocolState === ProtocolState.CONNECTED_AND_BIND) {
                    this.setData({
                        finding:false,
                        finded:false,
                        nofind:false,
                        bindSuccess:true,
                    })
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
