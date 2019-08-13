//index.js
//获取应用实例
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import Toast from "../../view/toast";
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
import ConnectionManager from "./connection-manager";
import BlowManager from "./blow-manager";
import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";

const app = getApp();

Page({
    data: {
        userInfo: {},
        firstInto: true,

        stateColor: ['#FF5F00','#31FF00'],
        homeHeartBox: ["home-heartbox-white",".home-heartbox-orange",".home-heartbox-orange-animation"],

        noteListMore: '跑步消耗热量比骑车高，消耗脂肪比骑车高，脂肪消耗比率也比骑车高。这也就意味着某种程度上，跑步在减肥效果方面全面好于骑车。',
        homeP:[
            "1. 请勿将设备远离手机",
            "2. 请勿关闭小程序",
            "3. 请勿关闭手机蓝牙",
            "4. 请勿熄灭屏幕"
        ],


        burnupShow: true,
        userInfoShow: true,
        headerRight: false,

        picState: false,
        textStateColor: true,

        connectpicShow: false,
        blowpicShow: false,

        homePointFirst: true,
        homePointSecond: false,

        homeBtn: true,

        homeTitle: false,
        homePShow: false,
        homeOrangeBtn: false,

        animationData: {},

        electricitypicShow: false,
    },

    useUrl() {
        HiNavigator.navigateToStrategy();
    },

    historyUrl() {
        HiNavigator.navigateToHistory();
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

    onLoad() {
        this.connectionPage = new ConnectionManager(this);
        this.connectionPage.unbind();
        this.blowPage = new BlowManager(this);
        //this.blowPage.blowing();
        app.onGetUserInfo = ({userInfo}) => this.setData({userInfo});
        let info = app.globalData.userInfo;
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
                this.handleTipText();
            });
        }

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

    onShow() {
        const action = this.connectionPage.action;
        const actionBlow = this.blowPage.actionBlow;
        let {connectState, protocolState} = app.getLatestBLEState();
        if (ProtocolState.BREATH_RESULT === protocolState) {
            protocolState = ProtocolState.CONNECTED_AND_BIND;
        }
        !!action[connectState] && action[connectState]();
        !!actionBlow[protocolState] && actionBlow[protocolState]();
        app.setBLEListener({
            bleStateListener: () => {
                console.log("查看电量2222")
                const {connectState, protocolState} = app.getLatestBLEState();
                !!action[connectState] && action[connectState]();
                !!actionBlow[protocolState] && actionBlow[protocolState]();
            },
            receiveDataListener: ({finalResult, state}) => {
                console.log("查看电量333333")
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
                    //上传得分并跳转结果页
                    Protocol.getAnalysisFetch({
                        dataValue: finalResult.result,
                    }).then(data => {
                        HiNavigator.navigateToResult({score: finalResult.result});
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
            this.handleTipText();
        }
    },

    handleTipText() {
        let noteListNum = Math.round(Math.random() * (this.data.noteList.length - 1));
        let noteListMore = this.data.noteList[noteListNum]['text_zh'];
        this.setData({
            noteListMore: noteListMore
        })
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
        app.getBLEManager().closeAll();
    },


    picAnimation(){
        const showanimation = wx.createAnimation({
            duration: 2000,
            timingFunction: 'linear',
        });
        const hideanimation = wx.createAnimation({
            duration: 2000,
            timingFunction: 'linear',
        });

        setTimeout(function () {
            showanimation.opacity(1).step();
            this.setData({
                animationData: showanimation
            })
        }.bind(this), 1000);

        setTimeout(function () {
            hideanimation.opacity(0).step();
            this.setData({
                animationData: hideanimation
            })
        }.bind(this), 6000);
    },

});
