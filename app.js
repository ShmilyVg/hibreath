//app.js
import 'libs/adapter';
import 'modules/network/update';
import {common} from "./libs/bluetooth/app/common";
import HiBreathBlueToothManager from "./modules/bluetooth/hi-breath-bluetooth-manager";

App({
    onLaunch(options) {
        let records = [];
        this.setCommonBLEListener({
            commonAppReceiveDataListener: ({finalResult, state}) => {
                if (ProtocolState.QUERY_DATA_ING === state.protocolState) {
                    const {length, isEat, timestamp} = finalResult;
                    if (records.length < length) {
                        records.push({state: isEat ? 1 : 0, timestamp});
                    } else {
                        Protocol.postMedicalRecordSave({records}).then(data => {
                            //TODO 向设备回复成功
                            this.bLEManager.sendQueryDataSuccessProtocol();
                        }).catch(res => {
                            console.log(res, '同步数据失败');
                        }).finally(() => records = []);
                    }

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

    onHide() {
        this.commonOnHide();
    },

    globalData: {
        userInfo: {nickname: '', headUrl: '', id: 0},

    },
    ...common
});
