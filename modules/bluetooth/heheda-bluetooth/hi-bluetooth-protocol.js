import {CommonConnectState, CommonProtocolState} from "heheda-bluetooth-state";
import {HexTools} from "./utils/tools";
import {ProtocolBody} from "./utils/protocol";
import {BlueToothUpdate, Protocol} from "../../network/network/index";

const commandIndex = 2, dataStartIndex = 3;

export default class HiBlueToothProtocol {

    constructor({blueToothManager, deviceIndexNum}) {
        this._blueToothManager = blueToothManager;
        this._protocolQueue = [];
        this.updateDeviceSoftwareManager = new BlueToothUpdate();
        this.protocolBody = new ProtocolBody({commandIndex, dataStartIndex, deviceIndexNum, blueToothManager});
        this._updatingTimeoutIndex = 0;
        // this._queryTimeoutIndex = -1;
        this.action = {
            //由手机发出的连接请求
            '0x01': () => {
                this.sendData({command: '0x01'});
            },
            //由设备发出的连接反馈 1接受 2不接受 后面的是
            '0x02': ({dataArray}) => {
                console.log(dataArray, "查看是否允许绑定")
                const isConnected = HexTools.hexArrayToNum(dataArray.slice(0, 1)) === 1;
                const deviceId = HexTools.hexArrayToNum(dataArray.slice(1));
                console.log('绑定结果', dataArray, deviceId, isConnected);
                //由手机回复的连接成功
                if (isConnected) {
                    Protocol.postDeviceBind({
                        deviceId,
                        mac: blueToothManager.getDeviceMacAddress()
                    }).then(() => {
                        console.log('绑定协议发送成功');
                        this.startCommunication();
                        blueToothManager.setBindMarkStorage();
                        blueToothManager.sendQueryDataRequiredProtocol();
                        blueToothManager.updateBLEStateImmediately(
                            this.protocolBody.getOtherStateAndResultWithConnectedState({protocolState: CommonProtocolState.CONNECTED_AND_BIND})
                        )
                    }).catch((res) => {
                        console.log('绑定协议报错', res);
                        blueToothManager.updateBLEStateImmediately(blueToothManager.getState({connectState: CommonConnectState.UNBIND}))
                    });
                } else {
                    blueToothManager.clearConnectedBLE();
                }
                // isConnected && this.startCommunication();
                // return {
                //     state: CommonProtocolState.GET_CONNECTED_RESULT_SUCCESS,
                //     dataAfterProtocol: {isConnected, deviceId}
                // };
            },
            //App发送绑定成功
            '0x03': () => {
                this.sendData({command: '0x03'});
            },
            //由设备发出的时间戳请求，并隔一段时间发送同步数据
            '0x04': ({dataArray}) => {
                console.log("请求", dataArray)
                const battery = HexTools.hexArrayToNum(dataArray.slice(0, 1));
                const version = HexTools.hexArrayToNum(dataArray.slice(1, 3));
                wx.setStorageSync('indexVersion',  version);
                const deviceId = HexTools.hexArrayToNum(dataArray.slice(3, 11));
                wx.setStorageSync('indexDeviceId', deviceId);
                const _syncCount = HexTools.hexArrayToNum(dataArray.slice(11, 13)) || 0;
                console.log("总数", _syncCount)
                const now = Math.round(new Date() / 1000);
                console.log('小程序下发时间戳',now)
                this.sendData({command: '0x05', data: [now]}).then(() => {
                    this.sendQueryDataRequiredProtocol();
                });
                return {state: CommonProtocolState.TIMESTAMP, dataAfterProtocol: {battery, version, deviceId,_syncCount}};
            },
            //设备发出待机状态通知
            '0x06': () => {
                this.sendData({command: '0x07'});
                return {state: CommonProtocolState.DORMANT};
            },
            //由手机发出的查找设备请求
            '0x08': () => {
                this.sendData({command: '0x08'});
            },
            //设备反馈的查找设备结果，找到了设备
            '0x09': () => {
                return {state: CommonProtocolState.FIND_DEVICE};
            },
            //App请求同步数据
            '0x0a': () => {
                this.sendData({command: '0x0a'}).then(() => blueToothManager.updateBLEStateImmediately(
                    this.protocolBody.getOtherStateAndResultWithConnectedState({protocolState: CommonProtocolState.QUERY_DATA_START})
                ));
            },
            //App传给设备同步数据的结果
            '0x0b': ({isSuccess}) => {
                this.sendData({
                    command: '0x0b',
                    data: [isSuccess ? 1 : 2]
                });
                //     .finally(() => {
                //     if (isSuccess) {
                //         clearTimeout(this._queryTimeoutIndex);
                //         this._queryTimeoutIndex = setTimeout(() => {
                //             blueToothManager.updateBLEStateImmediately(this.protocolBody.getOtherStateAndResultWithConnectedState({protocolState: CommonProtocolState.QUERY_DATA_FINISH}));
                //         }, 2000);
                //     } else {
                //         blueToothManager.updateBLEStateImmediately(this.protocolBody.getOtherStateAndResultWithConnectedState({protocolState: CommonProtocolState.QUERY_DATA_FINISH}));
                //     }
                // });
            },
            //APP传给设备 是否同步离线数据 01传 02不传
            '0x3d': ({isSuccess}) => {
                this.sendData({
                    command: '0x3d',
                    data: [isSuccess ? 1 : 2]
                });
            },
            //APP通知设备是否上传检测记录
            '0x40': ({isSuccess}) => {
                this.sendData({
                    command: '0x40',
                    data: [isSuccess ? 1 : 2]
                });
            },
            '0xab': ({dataArray}) => {
                if (!!this._updateTool) {
                    const index = HexTools.hexArrayToNum(dataArray.slice(0, 2));
                    const data = this._updateTool.getDataByIndex({index});
                    this._blueToothManager.sendData({
                        buffer: this.protocolBody.createUpdateBuffer({
                            index,
                            data
                        })
                    }).then(() => {
                        if (index < this._updateTool.count - 1) {
                            clearTimeout(this._updatingTimeoutIndex);
                            this._updatingTimeoutIndex = setTimeout(() => {
                                blueToothManager.updateBLEStateImmediately(this.protocolBody.getOtherStateAndResultWithConnectedState({protocolState: CommonProtocolState.UPDATING}));
                            }, 1500);
                        } else {
                            setTimeout(() => {
                                blueToothManager.updateBLEStateImmediately(this.protocolBody.getOtherStateAndResultWithConnectedState({protocolState: CommonProtocolState.UPDATE_FINISH}));
                            }, 500);
                        }
                    });

                }
            }
        }
    }

    requireDeviceBind() {
        !this.getDeviceIsBind() && this.action['0x01']();
    }

    sendQueryDataRequiredProtocol() {
        if (this.getDeviceIsBind()) {
            const queryDataTimeoutIndex = setTimeout(() => {
                this.action['0x0a']();
            }, 200);
            this._protocolQueue.push(queryDataTimeoutIndex);
        }
    }

    sendData({command, data}) {
        return this._blueToothManager.sendData({buffer: this.createBuffer({command, data})});
    }

    sendQueryDataSuccessProtocol({isSuccess}) {
        if (this.getDeviceIsBind()) {
            this.action['0x0b']({isSuccess});
        }
    }

    sendISpage({isSuccess}) {
        if (this.getDeviceIsBind()) {
            this.action['0x3d']({isSuccess});
        }
        console.log('小程序发送了 3d指令');
    }
    sendISvalue({isSuccess}) {
        if (this.getDeviceIsBind()) {
            this.action['0x40']({isSuccess});
        }
    }

    startCommunication() {
        this.action['0x03']();
    }

    startData() {
        this.sendData({command: '0x05', data: [Math.round(new Date() / 1000)]});
        console.log("执行重新获取状态,发送时间戳为：",Math.round(new Date() / 1000))
    }

    getDeviceIsBind() {
        this._isBindMark = this._isBindMark || wx.getStorageSync('isBindDevice');
        console.log('获取设备是否被绑定', this._isBindMark);
        return this._isBindMark;
    }

    setBindMarkStorage() {
        try {
            wx.setStorageSync('isBindDevice', true);
            this._isBindMark = true;
        } catch (e) {
            console.log('setBindMarkStorage()出现错误');
            wx.setStorageSync('isBindDevice', true);
            this._isBindMark = true;
            console.log('setBindMarkStorage()重新存储成功');
        }
    }

    clearBindMarkStorage() {
        wx.removeStorageSync('isBindDevice');
        this._isBindMark = false;
    }

    clearSendProtocol() {
        let temp;
        while (temp = this._protocolQueue.pop()) {
            clearTimeout(temp);
        }
    }

    receive({receiveBuffer}) {
        return this.protocolBody.receive({action: this.action, receiveBuffer});
    }

    createBuffer({command, data}) {
        return this.protocolBody.createBuffer({command, data});
    }
}
