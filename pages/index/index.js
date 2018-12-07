//index.js
//获取应用实例
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import Toast from "../../view/toast";
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
import ConnectionManager from "./connection-manager";
import BlowManager from "./blow-manager";
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
        HiNavigator.navigateToDeviceUnbind();
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
                app.getBLEManager().clearConnectedBLE();
                this.connectionPage.unbind();
            } else {
                app.getBLEManager().setBindMarkStorage();
                app.getBLEManager().connect();
                this.setData({bindList});
            }
        })
    },

    onShow() {
        const action = this.connectionPage.action;
        const actionBlow = this.blowPage.actionBlow;
        let latestState = app.getLatestBLEState();
        if (BlueToothState.BREATH_FINISH_AND_SUCCESS === latestState) {
            latestState = BlueToothState.CONNECTED_AND_BIND;
        }
        !!action[latestState] && action[latestState]();
        !!actionBlow[latestState] && actionBlow[latestState]();
        app.setBLEListener({
            bleStateListener: () => {
                const state = app.getLatestBLEState();
                !!action[state] && action[state]();
                !!actionBlow[state] && actionBlow[state]();
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
    }
});
