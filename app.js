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
        this.bLEManager.setBLEListener({receiveDataListener, bleStateListener});
    },

    onLaunch() {
        this.doLogin();
        this.bLEManager = new HiBreathBlueToothManager();
    },
    doLogin() {
        setTimeout(() => Login.doLogin().then(() => UserInfo.get()).then(({userInfo}) => {
            this.onGetUserInfo && this.onGetUserInfo({userInfo});
        }));
    },
    globalData: {
        userInfo: {nickname: '', headUrl: '', id: 0}
    }
});
