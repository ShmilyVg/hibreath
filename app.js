//app.js
import 'libs/adapter';
import 'modules/network/update';
import UserInfo from "./modules/network/userInfo";
import Login from "./modules/network/login";
import HiBreathBlueToothManager from "./modules/bluetooth/hi-breath-bluetooth-manager";
import BlueToothState from "./modules/bluetooth/state-const";
import Protocol from "./modules/network/protocol";

App({
    onGetUserInfo: null,

    getBLEManager() {
        return this.bLEManager;
    },

    setBLEListener({receiveDataListener, bleStateListener}) {
        this.appReceiveDataListener = receiveDataListener;
        this.appBLEStateListener = bleStateListener;
    },

    getLatestBLEState() {
        return this.globalData.latestBLEState;
    },

    onLaunch() {
        this.doLogin();
        this.bLEManager = new HiBreathBlueToothManager();
        this.bLEManager.setBLEListener({
            receiveDataListener: ({finalResult, state}) => {
                if (BlueToothState.DEVICE_ID_GET_SUCCESS === state) {
                    Protocol.postDeviceBind({deviceId: finalResult}).then(() => {
                        // wx.setStorageSync('get_device_id', finalResult);
                        this.appReceiveDataListener && this.appReceiveDataListener({finalResult, state});
                    }).catch((res) => {
                        console.log('绑定协议报错', res);
                        this.appBLEStateListener && this.appBLEStateListener({state: BlueToothState.UNBIND});
                    });
                } else {
                    this.appReceiveDataListener && this.appReceiveDataListener({finalResult, state});
                }
            }, bleStateListener: ({state}) => {
                this.globalData.latestBLEState = state;
                console.log('状态更新', state);
                this.appBLEStateListener && this.appBLEStateListener({state});
            }
        })
    },
    doLogin() {
        setTimeout(() => Login.doLogin().then(() => UserInfo.get()).then(({userInfo}) => {
            this.onGetUserInfo && this.onGetUserInfo({userInfo});
        }));
    },
    globalData: {
        userInfo: {nickname: '', headUrl: '', id: 0},
        latestBLEState: ''
    }
});
