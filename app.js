//app.js
import "./utils/config";
import {common} from "./modules/bluetooth/heheda-bluetooth/app/common";
import HiBreathBlueToothManager from "./modules/bluetooth/hi-breath-bluetooth-manager";
import {ProtocolState,ConnectState} from "./modules/bluetooth/bluetooth-state";
import Protocol from "./modules/network/protocol";
import {WXDialog} from "heheda-common-view";
import CommonProtocol from "./modules/network/network/libs/protocol";
import {initAnalysisOnApp} from "./modules/analysis/mta";
import HiNavigator from "./navigator/hi-navigator";


App({

    onDeviceBindInfoListener: null,
    onBatteryInfoListener: null,
    isOTAUpdate: false,
    otaUrl: {},
    onLaunch(options) {
        let records = [], count = 0;
        this.otaVersion = -1;
        this.needCheckOTAUpdate = true;
        initAnalysisOnApp();
        this.setCommonBLEListener({
            // commonAppSignPowerListener: (hiDevices) => {
            //     this.appBLESignPowerListener && this.appBLESignPowerListener(hiDevices);
            // },
            commonAppReceiveDataListener: ({finalResult, state}) => {
                if (ProtocolState.QUERY_DATA_ING === state.protocolState) {
                    console.log('接收到的',finalResult);
                    const {timestamp, result, currentLength: length} = finalResult;
                    let {currentIndex} = finalResult;
                    if (records.length < length) {
                        records.push({dataValue: result, timestamp:timestamp});
                        count++;
                        console.log(records,"records")
                        console.log(length,"length")
                        if (records.length === length) {
                            Protocol.postBreathDataSync({items:records}).then(data => {
                                console.log('同步数据成功2');
                                this.bLEManager.sendQueryDataSuccessProtocol({isSuccess: true});
                            }).catch(res => {
                                this.queryDataFinish();
                                console.log(res, '同步数据失败');
                            }).finally(() => records = []);
                        }
                        console.log('同步数据的数组', records);
                    } else if (!length) {
                        if (count === 0) {
                            this.isQueryEmptySuccess = true;
                        }
                        count = 0;
                        this.queryDataFinish();
                        setTimeout(() => {
                            console.log('硬件传来的固件版本号', this.otaVersion);
                            console.log('是否显示版本升级标志位', this.needCheckOTAUpdate);
                            if (this.otaVersion !== -1) {
                                if (this.needCheckOTAUpdate) {
                                    this.needCheckOTAUpdate = false;
                                    CommonProtocol.postBlueToothUpdate({
                                        deviceId: this.bLEManager.getDeviceMacAddress(),
                                        version: this.otaVersion
                                    }).then(data => {
                                        const {update: isUpdate, zip} = data.result;
                                        console.log('data.result', data.result);
                                        if (zip) {
                                            const {bin: binArray, dat: datArray} = zip;
                                            if (isUpdate && binArray && binArray.length && datArray && datArray.length) {
                                                WXDialog.showDialog({
                                                    content: '为了给您带来更好的体验\n' + '即将为设备进行升级',
                                                    showCancel: true,
                                                    confirmText: "立即升级",
                                                    cancelText: "暂时不用",
                                                    confirmEvent: () => {
                                                        const {url: binUrl, md5: binMd5} = binArray[0];
                                                        const {url: datUrl, md5: datMd5} = datArray[0];
                                                        HiNavigator.relaunchToUpdatePage({binUrl, datUrl});
                                                    },
                                                    cancelEvent: () => {
                                                        WXDialog.showDialog({
                                                            content: '好的！本次您可以继续正常使用\n' + '下次打开小程序时将再次提醒',
                                                            confirmText: '我知道啦',

                                                        })
                                                    }
                                                });

                                            } else {
                                                console.log('无需升级');
                                            }
                                        }
                                    });
                                }

                            }
                        })
                        // this.bLEManager.sendQueryDataSuccessProtocol({isSuccess: true});
                    } else {
                        console.log('同步数据溢出', records);
                        count = 0;
                    }

                } else if (ProtocolState.TIMESTAMP === state.protocolState) {
                    this.otaVersion = finalResult.version;
                    console.log("暂时查看电量",finalResult.battery)
                    //TODO 暂时注释掉
                    // Protocol.postDeviceElectricity({electricity: finalResult.battery / 100});
                    if (finalResult.battery < 21) {
                        this.onBatteryInfoListener && this.onBatteryInfoListener({battery: true});
                        this.globalData.globalBattery = 2
                    } else {
                        this.onBatteryInfoListener && this.onBatteryInfoListener({battery: false});
                        this.globalData.globalBattery = 3
                    }
                    setTimeout(() => {
                        this.getBLEManager().resendBLEData();
                    }, 10);
                } else {
                    this.appReceiveDataListener && this.appReceiveDataListener({finalResult, state});
                }
            },
            commonAppBLEStateListener: ({state}) => {
                switch (state.connectState) {
                    case ConnectState.UNBIND:
                    case ConnectState.UNAVAILABLE:
                    case ConnectState.DISCONNECT:
                    case ConnectState.NOT_SUPPORT:
                        records = [];
                        this.isQuery = false;
                        this.isQueryDataFinish = false;
                        break;
                }
                if (state.protocolState === ProtocolState.QUERY_DATA_FINISH) {
                    this.isQueryDataFinish = true;
                    this.isQuery = false;
                }
                this.appBLEStateListener && this.appBLEStateListener({state});
            }
        });
        this.commonOnLaunch({options, bLEManager: new HiBreathBlueToothManager()});

        this.appLoginListener = ({loginState}) => {
            if (loginState === this.NOT_REGISTER) {
                this.bLEManager.clearConnectedBLE();
                // HiNavigator.reLaunchToBindDevicePage();
            }
        };
    },
    queryDataFinish() {
        this._updateBLEState({
            state: {
                connectState: ConnectState.CONNECTED,
                protocolState: ProtocolState.QUERY_DATA_FINISH
            }
        });
    },
    onShow(options) {
        if (!this.isOTAUpdate) {
            this.commonOnShow({options});
            // Protocol.getDeviceBindInfo().then(data => {
            //     if (data.result) {
            //         const {mac} = data.result;
            //         console.log('getDeviceBindInfo?mac=', mac);
            //         this.bLEManager.setBindMarkStorage();
            //         this.connectAppBLE({macId: mac});
            //         this.onDeviceBindInfoListener && this.onDeviceBindInfoListener({deviceId: mac});
            //     } else {
            //         this.bLEManager.clearConnectedBLE();
            //     }
            // })
        }

    },

    onHide() {
        this.records = [];
        this.commonOnHide();
    },

    globalData: {
        refreshIndexPage: false,
        userInfo: {nickname: '', headUrl: '', id: 0},
        globalBattery: 1, //1为默认，2为低电量，3为高电量
    },
    ...common
});
