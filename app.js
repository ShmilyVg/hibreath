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
                if (BlueToothState.GET_CONNECTED_RESULT_SUCCESS === state) {
                    const {isConnected, deviceId} = finalResult;
                    if (isConnected) {
                        Protocol.postDeviceBind({deviceId: deviceId}).then(() => {
                            this.bLEManager.setConnectedMarkStorage();
                            this.appReceiveDataListener && this.appReceiveDataListener({finalResult, state});
                        }).catch((res) => {
                            console.log('绑定协议报错', res);
                            this._updateBLEState({state: BlueToothState.UNBIND});
                        });
                    } else {
                        this.bLEManager.clearConnectedBLE().finally(() => {
                            this._updateBLEState({state});
                        });
                    }
                } else {
                    this.appReceiveDataListener && this.appReceiveDataListener({finalResult, state});
                }
            }, bleStateListener: ({state}) => {
                this.globalData.latestBLEState = state;
                console.log('状态更新', state);
                BlueToothState.CONNECTED === state && this.bLEManager.requireDeviceConnected();
                this._updateBLEState({state});
            }
        })
    },

    _updateBLEState({state}) {
        this.appBLEStateListener && this.appBLEStateListener({state});
    },
    onHide() {
        this.bLEManager.closeAll();
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
