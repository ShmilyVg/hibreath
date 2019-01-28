//app.js
import "./utils/config";
import {common} from "heheda-bluetooth";
import HiBreathBlueToothManager from "./modules/bluetooth/hi-breath-bluetooth-manager";
import {ProtocolState} from "./modules/bluetooth/bluetooth-state";
import Protocol from "./modules/network/protocol";


App({
    onLaunch(options) {
        this.records = [];
        let tempCount = 0;
        this.setCommonBLEListener({
            commonAppReceiveDataListener: ({finalResult, state}) => {
                if (ProtocolState.QUERY_DATA_ING === state.protocolState) {
                    const {timestamp, result, currentLength} = finalResult;
                    let {currentIndex} = finalResult;
                    this.records.push({dataValue: result, timestamp, currentIndex: ++currentIndex});
                    if (currentLength === this.records.length) {//与currentLength相等时校验本次接收到的所有数据
                        const sum = this.records.reduce((prev, cur) => prev.currentIndex + cur.currentIndex);
                        const sum2 = currentLength * (currentLength + 1) / 2;
                        if (sum === sum2) {
                            Protocol.postBreathDataSync({items: this.records}).then(data => {
                                this.bLEManager.sendQueryDataSuccessProtocol({isSuccess: true});
                            }).catch(res => {
                                console.log(res, '同步数据失败');
                                this.bLEManager.sendQueryDataSuccessProtocol({isSuccess: false});
                            }).finally(() => this.records = []);
                        } else {
                            this.bLEManager.sendQueryDataSuccessProtocol({isSuccess: false});
                            this.records = [];
                        }
                    }
                    console.log('同步数据的数组', this.records);
                } else {
                    this.appReceiveDataListener && this.appReceiveDataListener({finalResult, state});
                }
            },
            commonAppBLEStateListener: ({state}) => {
                this.appBLEStateListener && this.appBLEStateListener({state});
            }
        });
        this.commonOnLaunch({options, bLEManager: new HiBreathBlueToothManager()});
    },

    onShow(options) {
        this.commonOnShow({options});
    },

    onHide() {
        this.records = [];
        this.commonOnHide();
    },

    globalData: {
        userInfo: {nickname: '', headUrl: '', id: 0},

    },
    ...common
});
