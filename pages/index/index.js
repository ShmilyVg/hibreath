//index.js
//获取应用实例
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import Toast from "../../view/toast";
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";


import * as tools from "../../utils/tools";
import ConnectionManager from "./connection-manager";
import BlowManager from "./blow-manager";
import HiBreathBlueToothManager from "../../modules/bluetooth/hi-breath-bluetooth-manager";
import BlueToothState from "../../modules/bluetooth/state-const";

const app = getApp();

Page({
    data: {
        userInfo: {},
        box3State: ["unjoin", "join", "join-done", "ready"],
        box4State: ["home-heart-box4-start", "home-heart-box4-done", "home-heart-box4-num"],
        firstInto: true,
        bindList: [],
        noteListMore: '跑步消耗热量比骑车高，消耗脂肪比骑车高，脂肪消耗比率也比骑车高。这也就意味着某种程度上，跑步在减肥效果方面全面好于骑车。'
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
        app.getBLEManager().connect();
        // this.connectionPage = new ConnectionManager(this);
        // this.connectionPage['disconnect']();
    },

    setBtnClick() {
        HiNavigator.navigateToDeviceUnbind({deviceId: this.data.bindList[0]});
    },

    onLoad() {
        this.connectionPage = new ConnectionManager(this);
        this.connectionPage.unbind();
        this.blowPage = new BlowManager(this);
        /*this.blowPage.blowdone();*/

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

        Protocol.getDeviceBindList().then(data => {
            let bindList = data.result;
            console.log('获取到的设备列表', data);
            if (bindList.length === 0) {
                app.getBLEManager().closeAll();
                this.connectionPage.unbind();
            } else {
                // app.getBLEManager().setBindMarkStorage();
                app.getBLEManager().connect();
                this.setData({bindList});
            }
            console.log(bindList)
        })
    },

    onShow() {
        const action = this.connectionPage.action;
        const antionBlow = this.blowPage.actionBlow;
        const latestState = app.getLatestBLEState();
        !!action[latestState] && action[latestState]();
        !!antionBlow[latestState] && antionBlow[latestState]();
        app.setBLEListener({
            bleStateListener: ({state}) => {
                !!action[state] && action[state]();
                !!antionBlow[state] && antionBlow[state]();
            },
            receiveDataListener: ({finalResult, state}) => {
                if (BlueToothState.BREATH_FINISH_AND_SUCCESS === state) {
                    HiNavigator.navigateToResult({score: finalResult.result});
                }
            }
        });
        if (!this.data.firstInto) {
            this.handleTipText();
        }
        app.getBLEManager().getBindMarkStorage() && app.getBLEManager().connect();
    },

    handleTipText() {
        let noteListNum = Math.round(Math.random() * (this.data.noteList.length - 1));
        let noteListMore = this.data.noteList[noteListNum]['text_zh'];
        this.setData({
            noteListMore: noteListMore
        })
    },

    onGetUserInfoEvent(e) {
        Toast.showLoading();
        const {detail: {userInfo, encryptedData, iv}} = e;
        Login.doRegister({
            userInfo,
            encryptedData,
            iv
        })
            .then(() => UserInfo.get())
            .then(({userInfo}) => this.setData({userInfo}))
            .catch(() => setTimeout(Toast.warn, 0, '获取信息失败')).finally(Toast.hiddenLoading);

    },
    onUnload() {
        app.getBLEManager().closeAll();
    }
});
