//app.js
import 'libs/adapter';
import 'modules/network/update';
import UserInfo from "./modules/network/userInfo";
import Login from "./modules/network/login";
import HiBreathBlueToothManager from "./modules/bluetooth/hi-breath-bluetooth-manager";

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
            receiveDataListener: ({finalResult}) => {
                this.appReceiveDataListener && this.appReceiveDataListener({finalResult});
            }, bleStateListener: ({state}) => {
                this.globalData.latestBLEState = state;
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
