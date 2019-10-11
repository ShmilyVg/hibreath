/**
 * @Date: 2019-09-23 16:15:14
 * @LastEditors: 张浩玉
 */
//index.js
//获取应用实例
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import {Toast} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
import ConnectionManager from "./connection-manager";
import BlowManager from "./blow-manager";
import * as tools from "../../utils/tools";
import {ConnectState, ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import {common} from "../../modules/bluetooth/heheda-bluetooth/app/common";
import HiBreathBlueToothManager from "../../modules/bluetooth/hi-breath-bluetooth-manager"; //页面标志位使用
const app = getApp();

Page({
    data: {
        userInfo: {},
        firstInto: true,
        isBind:false,

        noBind:false,
        tryAgain:false,
        finding:false,
        beginFat:false,
        readyimg:false,
        blowpicShow:false,
        textState:"",
        textStateEn:"",
        disblowImg:false,
        blowingImg:false,
        process:false,
        isShowBlow:true,

        homeP:[
            "1. 请勿将设备远离手机",
            "2. 请勿关闭小程序",
            "3. 请勿关闭手机蓝牙",
            "4. 请勿熄灭屏幕"
        ],

        homeTitle: false,

        homeOrangeBtn: false,


        electricitypicShow: false,
    },

    historyUrl() {
        HiNavigator.navigateToclickCheck();
    },

    bindBtnClick() {
        HiNavigator.navigateToDeviceBind();
    },
    disconnectBtnClick() {
        if (this.data.stateBtnShow){
            app.getBLEManager().connect();
        }
    },

    setBtnClick() {
        HiNavigator.navigateToDeviceUnbind();
    },
    onLaunch(options){
        this.commonOnLaunch({options, bLEManager: new HiBreathBlueToothManager()});
    },

    onLoad() {
        //检测页面保持常亮
        wx.setKeepScreenOn({
            keepScreenOn: true
        });

        this.connectionPage = new ConnectionManager(this);
        //this.connectionPage.unbind();
        this.blowPage = new BlowManager(this);
        //this.blowPage.blowing();
        app.onGetUserInfo = ({userInfo}) => this.setData({userInfo});
        let info = app.globalData.userInfo;
        console.log(app.globalData,"globalData")
        if (info) {
            this.setData({
                userInfo: info
            })
        }
        if (this.data.firstInto) {
            Protocol.getAnalysisNotes().then(data => {
                let noteList = data.result.list;

                this.setData({
                    noteList: noteList,
                    firstInto: false
                })
            });
        }

        /*电量测试*/
        let globalBattery = app.globalData.globalBattery;
        console.log('全局电量：', globalBattery);
        if (globalBattery === 1) {
            app.onBatteryInfoListener = ({battery}) => {
                if (battery) {
                    this.setData({
                        electricitypicShow: true
                    })
                }
            }
        } else {
            if (globalBattery === 2) {
                this.setData({
                    electricitypicShow: true
                })
            } else if (globalBattery === 3) {
                this.setData({
                    electricitypicShow: false
                })
            }
            setTimeout(function () {
                app.globalData.globalBattery = 0;
            }, 5000);
        }
        /*电量测试*/

        Protocol.getDeviceBindInfo().then(data => {
            let deviceInfo = data.result;
            console.log('获取到的设备', data);

            if (!deviceInfo) {
                app.getBLEManager().clearConnectedBLE();
                this.connectionPage.unbind();
            } else {
                app.getBLEManager().setBindMarkStorage();
                app.getBLEManager().connect({macId: deviceInfo.mac});
            }
        });

    },

    onShow(options) {
       /* const pages = getCurrentPages()
        const currPage = pages[pages.length - 1]  // 当前页
        // 是否绑定成功
        this.setData({
            isBind: currPage.data.isBind
        })*/
        const action = this.connectionPage.action;
        const actionBlow = this.blowPage.actionBlow;

        let {connectState, protocolState} = app.getLatestBLEState();
        console.log("app.getLatestBLEState()",app.getLatestBLEState())
        if (ProtocolState.BREATH_RESULT === protocolState) {
            protocolState = ProtocolState.CONNECTED_AND_BIND;
        }
        console.log('000',connectState)
        console.log('1111',protocolState)
        console.log("-----1212",)
       /* if(connectState === "connected"){
            if(protocolState === "query_data_start" || protocolState === "query_data_ing" || protocolState === "query_data_finish")
            this.blowPage.connected();
        }*/

        !!action[connectState] && action[connectState]();
        !!actionBlow[protocolState] && actionBlow[protocolState]();
        app.setBLEListener({
            bleStateListener: () => {
                console.log("查看电量2222",app.getLatestBLEState())
                const {connectState, protocolState} = app.getLatestBLEState();
                console.log("connectState",connectState)
                console.log("protocolState",protocolState)
                !!action[connectState] && action[connectState]();
                !!actionBlow[protocolState] && actionBlow[protocolState]();
            },
            receiveDataListener: ({finalResult, state}) => {
                console.log("查看电量333333",finalResult)
                /*
                 PRE_HOT_START: 'pre_hot_start',//开始预热状态
                 PRE_HOT_FINISH_AND_START_BREATH: 'pre_hot_finish_and_start_breath',//预热完成开始吹气
                 BREATH_RESULT: 'breath_result',//吹气完成返回结果
                 BREATH_RESTART: 'breath_restart',//重新吹气
                 BREATH_START: 'breath_start',//设备发出的开始吹气通知
                 BREATH_FINISH: 'breath_finish',//设备发出的吹气完成通知
                 */
                console.log("查看数据1",state.protocolState)
                console.log("查看数据2",ProtocolState.BREATH_RESULT)
                console.log("查看数据3",ProtocolState.TIMESTAMP)
                if (ProtocolState.BREATH_RESULT === state.protocolState) {
                    //上传PPM并跳转结果页
                    const toolfinalResult = tools.subStringNum(finalResult.result)/10
                    Protocol.getBreathDataAdd({
                        dataValue: toolfinalResult,
                    }).then(data => {
                        console.log(data.result.id)
                        HiNavigator.navigateBlowToResult({id: data.result.id});
                    });

                    //TIMESTAMP 设备获取时间戳
                }else if (ProtocolState.TIMESTAMP === state.protocolState) {
                    const {battery} = finalResult;
                    console.log("查看电量4444",finalResult)
                    if(battery < 20){
                        this.setData({
                            electricitypicShow: true,
                        })
                    }else{
                        this.setData({
                            electricitypicShow: false,
                        })
                    }
                }
            }
        });
        if (!this.data.firstInto) {

        }
    },



    onGetUserInfoEvent(e) {
        const {detail: {userInfo, encryptedData, iv}} = e;
        if (!!userInfo) {
            Toast.showLoading();
            Login.doRegister({
                userInfo,
                encryptedData,
                iv
            })
            .then(() => UserInfo.get())
            .then(({userInfo}) => !this.setData({userInfo}) && HiNavigator.navigateToDeviceBind())
            .catch(() => setTimeout(Toast.warn, 0, '获取信息失败')).finally(Toast.hiddenLoading);
        }
    },
    onUnload() {
        //app.getBLEManager().closeAll();
    },


    ...common
});
