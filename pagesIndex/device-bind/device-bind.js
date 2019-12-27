// pages/device-bind/device-bind.js
/**
 * @Date: 2019-09-25 15:36:52
 * @LastEditors: 张浩玉
 */
import {ConnectState, ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import HiNavigator from "../../navigator/hi-navigator";
import IndexCommonManager from "../index/view/indexCommon";
import {Toast, WXDialog} from "heheda-common-view";
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
        bindSuccessArr:[
            "若有饮酒请间隔24小时以上再进行检测",
            "吸烟、涂抹口红、喷香水等行为会对检测结果的准确性产生影响",
            "测试完毕后使用洁净柔软的干布或纸张轻轻擦拭干净吹气口。使用后请盖好保护盖，防止灰尘等细小异物"
        ],
        currentSwiper: 0,

    },


    getResultState({state}) {
        switch (state) {
            /*连接中*/
            case ConnectState.CONNECTING:
                wx.setNavigationBarColor({
                    frontColor: '#000000',
                    backgroundColor: '#fff',
                })
                this.indexCommonManager.setSearchingState();
                console.log('this.indexCommonManager',this.indexCommonManager)
                this.setData({
                    bgColor:"#fff",
                    finding:true,//正在寻找设备标志位
                    finded:false,//找到并绑定
                    noBind:false,
                    bindSuccess:false,
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
                app.getBLEManager().clearConnectedBLE();
                this.indexCommonManager.setDissearchState();
                this.setData({
                    bgColor:"#EE6F69",
                    finding:false,
                    finded:false,
                    bindHint:"",
                    bindSuccess:false,
                });
                break;
            default:
                this.indexCommonManager.setSearchedState();
                this.setData({
                    bgColor:"#fff",
                    finding:false,
                    bindSuccess:false,
                    finded:true,
                    contentStateB:"燃脂精灵已经找到",
                    contentStateS:"短按设备按键·确认绑定",
                });
                break;
        }
    },
    swiperChange: function (e) {
        this.setData({
            currentSwiper: e.detail.current
        })
    },
    showResult({state}) {
        this.getResultState({state});
    },

    reConnectEvent() {
        //检测蓝牙状态
       /* wx.openBluetoothAdapter({
            success (res) {
                console.log(res,'success')
                app.getBLEManager().connect();
            },
            fail (res) {
                console.log(res,'fail')
                if(res.errCode == 10001 ||res.errCode == 10000){
                    setTimeout(() => {
                        WXDialog.showDialog({title: 'TIPS', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
                    },200);
                }
            }
        })*/
        wx.getSystemInfo({
            success (res) {
                console.log('locationEnabled',res.locationEnabled,res.bluetoothEnabled)
                if(res.locationEnabled && res.bluetoothEnabled){
                    app.getBLEManager().connect();
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
                }else{
                    setTimeout(() => {
                        WXDialog.showDialog({title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
                    },200);
                    return
                }
            }
        })
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
              /*  if (state.protocolState === ProtocolState.CONNECTED_AND_BIND) {
                    this.setData({
                        bindSuccess:true,
                        finding:false,
                        finded:false,
                        nofind:false,

                    })

                }else{
                    this.showResult({state: state.connectState});
                }*/
                if (state.protocolState === ProtocolState.CONNECTED_AND_BIND) {

                    //绑定后 跳转绑定成功页面  点击按钮再进入index页面
                    this.isBind = true;
                    setTimeout(() => HiNavigator.navigateSuccessInfo());
                    /* setTimeout(() => HiNavigator.navigateBack({delta: 1}));*/
                }else{
                    console.log('diao')
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
        console.log("this.isBind11", this.isBind)
        !this.isBind && app.getBLEManager().clearConnectedBLE();
        app.setBLEListener({
            bleStateListener: null
        });
    }
});
