//index.js
//获取应用实例
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import Toast from "../../view/toast";
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
import ConnectionManager from "./connection-manager";
import BlowManager from "./blow-manager";
import UpdataManager from "./updata-manager";
import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import {BlueToothUpdate} from "heheda-network";

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
                const {connectState, protocolState} = app.getLatestBLEState();
                !!action[connectState] && action[connectState]();
                !!actionBlow[protocolState] && actionBlow[protocolState]();
            },
            receiveDataListener: ({finalResult, state}) => {
                if (ProtocolState.BREATH_RESULT === state.protocolState) {
                    HiNavigator.navigateToResult({score: finalResult.result});
                }else if (ProtocolState.TIMESTAMP === state.protocolState) {
                    const {battery} = finalResult;
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
