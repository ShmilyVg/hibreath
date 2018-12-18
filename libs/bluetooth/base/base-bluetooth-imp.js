import AbstractBlueTooth from "./abstract-bluetooth";
import {CommonConnectState} from "./state";

/**
 * 蓝牙核心业务的封装
 */
export default class BaseBlueToothImp extends AbstractBlueTooth {

    constructor() {
        super();
        this._isInitWXBLEListener = false;
        this._scanBLDListener = null;
        this._bleStateListener = null;

        this.errorType = {
            '-1': {
                errMsg: 'createBLEConnection:fail:already connect', type: CommonConnectState.CONNECTED,
            },
            '10001': {
                errMsg: '', type: CommonConnectState.UNAVAILABLE,
            },
            '10006': {
                errMsg: 'closeBLEConnection:fail:no connection', type: CommonConnectState.DISCONNECT,
            },
            '10009': {
                errMsg: 'Android System not support', type: CommonConnectState.NOT_SUPPORT
            }
        };
        let timeoutIndex = 0;
        wx.onBluetoothDeviceFound(() => {
            console.log('开始扫描');
            if (!!this._scanBLDListener) {
                super.getBlueToothDevices().then(res => this._scanBLDListener({devices: res.devices})).catch();
            } else {
                clearTimeout(timeoutIndex);
                timeoutIndex = setTimeout(() => {
                    super.getBlueToothDevices().then(res => {
                        const {devices} = res;
                        // console.log('发现新的蓝牙设备', devices);
                        if (devices.length > 0) {
                            const device = devices.reduce((prev, cur) => prev.RSSI > cur.RSSI ? prev : cur);
                            // console.log('要连接的设备', device);
                            if (!this._deviceId) {
                                this._updateFinalState({
                                    promise: this.createBLEConnection({deviceId: device.deviceId})
                                });
                            }
                        }
                    }).catch();
                }, 2000);
            }
        });
    }


    /**
     * 设置蓝牙行为的监听
     * @param receiveDataListener 必须设置
     * @param bleStateListener 必须设置
     * @param scanBLEListener 不必须设置 如果没有设置该监听，则在扫描蓝牙设备后，会自动连接距离手机最近的蓝牙设备；否则，会返回扫描到的所有设备
     */
    setBLEListener({receiveDataListener, bleStateListener, scanBLEListener}) {
        this._receiveDataListener = receiveDataListener;
        this._bleStateListener = bleStateListener;
        this._scanBLDListener = scanBLEListener;
    }

    /**
     * 打开或关闭蓝牙适配器
     * @returns {*}
     */
    triggerBLEAdapter() {
        return this._isOpenAdapter ? super.closeAdapter() : super.openAdapter();
    }

    /**
     * 打开或关闭蓝牙的扫描功能
     * @returns {*}
     */
    triggerBLEDiscovery() {
        return this._isStartDiscovery ? super.stopBlueToothDevicesDiscovery() : super.startBlueToothDevicesDiscovery();
    }

    /**
     * 打开蓝牙适配器并扫描蓝牙设备，或是试图连接上一次的蓝牙设备
     * 通过判断this._deviceId来确定是否为首次连接。
     * 如果是第一次连接，则需要开启蓝牙扫描，通过uuid过滤设备，来连接到对应的蓝牙设备，
     * 如果之前已经连接过了，则这次会按照持久化的deviceId直接连接
     * @returns {*}
     */
    openAdapterAndConnectLatestBLE() {
        if (this._isConnected) {
            return new Promise((resolve) => resolve);
        }
        return !this._bleStateListener(this.getState({connectState: CommonConnectState.CONNECTING}))
            && this._updateFinalState({
                promise: this.openAdapter().then(() => !!this._deviceId ?
                    this.createBLEConnection({deviceId: this._deviceId}) : this.startBlueToothDevicesDiscovery())
            });
    }

    /**
     * 重新连接蓝牙
     * 该接口只会重连之前上一次连接过的蓝牙设备
     * @returns {boolean|*}
     */
    reconnectBLE() {
        this._isConnected = false;
        return !this._bleStateListener(this.getState({connectState: CommonConnectState.CONNECTING}))
            && this._updateFinalState({promise: this.createBLEConnection({deviceId: this._deviceId})});
    }

    /**
     * 断开蓝牙连接
     * @returns {*}
     */
    closeBLEConnection() {
        return this._updateFinalState({promise: super.closeBLEConnection()});
    }

    updateBLEState({state}) {
        return this._bleStateListener({state});
    }

    getState({connectState, protocolState}) {
        return {state: {connectState, protocolState}};
    }

    /**
     * 更新蓝牙设备的连接状态，该函数私有
     * 更新状态意味着，最终会回调setBLEListener中传入的bleStateListener函数，
     * 并会在bleStateListener的参数state中接收到对应的状态值
     * 状态值均定义在BaseBlueToothImp中
     * @param promise
     * @returns {Promise<T | never>}
     * @private
     */
    _updateFinalState({promise}) {
        return promise.then(({isConnected = false} = {}) => {
            if (!isConnected) {
                return;
            }
            if (!this._isInitWXBLEListener) {
                wx.onBluetoothAdapterStateChange((res) => {
                    console.log('适配器状态changed, now is', res);
                    if (!res.available) {
                        super.closeAdapter();
                    }
                });

                wx.onBLEConnectionStateChange((res) => {
                    // 该方法回调中可以用于处理连接意外断开等异常情况
                    console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
                    if (!res.connected) {
                        this._bleStateListener(this.getState({connectState: CommonConnectState.DISCONNECT}));
                        if (!this._isActiveCloseBLE) {
                            this.reconnectBLE();
                        } else {
                            this._isActiveCloseBLE = false;
                        }
                    }
                });
                this._isInitWXBLEListener = true;
            }
            this._bleStateListener(this.getState({connectState: CommonConnectState.CONNECTED}));
        })
            .catch((res) => {
                console.log(res);
                const errorFun = this.errorType[res.errCode];
                if (!!errorFun) {
                    this._bleStateListener(this.getState({connectState: errorFun.type}));
                } else {
                    this._bleStateListener(this.getState({connectState: CommonConnectState.DISCONNECT}));
                }
            });
    }
}
