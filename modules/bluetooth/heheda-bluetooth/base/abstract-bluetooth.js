/**
 * 微信小程序蓝牙功能的底层封装
 * 该类的所有业务均为最基础的部分，是不需要进行修改的
 * 呵呵哒认为这个类是抽象的，这就意味着该类只能被继承(虽然JS中没有抽象类)
 *
 */

import {ErrorState} from "../utils/error-state";
import * as mta from "../../../analysis/mta";
import CommonProtocol from "../../../network/network/libs/protocol";
const log = require('../../../../log.js')
/*暂作修改*/
const INIT_TIMEOUT = 15;
export default class AbstractBlueTooth {
    constructor() {
        this._isOpenAdapter = false;
        this._isStartDiscovery = false;
        this._isActiveCloseBLE = false;
        this._isActiveCloseDiscovery = false;
        this._isConnected = false;
        this._deviceId = '';
        this._serviceId = '';
        this._characteristicId = '';
        this._receiveDataListener = null;
        this._startDiscoveryTimeoutIndex = 0;
        this.UUIDs = [];
        this._isConnectBindDevice = false;
        this.hiServiceUUID = '';
        this._receiveDataOutsideistener = null;
        this.connectionInfo = {timeout: INIT_TIMEOUT, count: 4, index: 1};
        this._receiveDataInsideListener = ({receiveBuffer}) => {
            if (!!this._receiveDataListener) {
                const {finalResult, state, filter} = this.dealReceiveData({receiveBuffer});
                !filter && this._receiveDataListener({finalResult, state});
            }
        };
        this.eventStatistics = {};

    }

    init() {
        setTimeout(() => {
            this.isBugPhone = getApp().globalData.systemInfo.isBugPhone;
        });
    }

    /**
     * 处理从连接的蓝牙中接收到的数据
     * 该函数必须在子类中重写！
     * 也千万不要忘了在重写时给这个函数一个返回值，作为处理数据后，传递给UI层的数据
     * 可以参考_receiveDataInsideListener
     * @param receiveBuffer 从连接的蓝牙中接收到的数据
     * @returns 传递给UI层的数据
     */
    dealReceiveData({receiveBuffer}) {

    }

    getDeviceMacAddress() {
        return this._deviceId || wx.getStorageSync('deviceId');
    }

    setDeviceMacAddress({macId}) {
        try {
            wx.setStorageSync('deviceId', this._deviceId = macId);
        } catch (e) {
            console.log('setDeviceMacAddress()出现错误 deviceId=', this._deviceId);
            wx.setStorageSync('deviceId', this._deviceId = macId);
            console.log('setDeviceMacAddress()重新存储成功');
        }
    }

    /**
     * 打开蓝牙适配器
     * 只有蓝牙开启的状态下，才可执行成功
     * @returns {Promise<any>}
     */
    openAdapter() {
        console.log('我被调用了')
        const isBugPhone = this.isBugPhone;
        !this._deviceId && (this._deviceId = this.getDeviceMacAddress());
        this._isActiveCloseBLE = false;
        console.log('设备id', this._deviceId || 'undefined', '是否开启适配器', this._isOpenAdapter, '_isActiveCloseBLE', this._isActiveCloseBLE, 'isBugPhone', isBugPhone);
        return new Promise((resolve, reject) => {
            if (!this._isOpenAdapter) {
                this.closeAdapter().finally(() => {
                    setTimeout(() => {
                        wx.openBluetoothAdapter({
                            success: (res) => {
                                console.log('打开蓝牙Adapter成功', res);
                                // this.stopBlueToothDevicesDiscovery().finally(() => {
                                this._isOpenAdapter = true;
                                resolve({isOpenAdapter: this._isOpenAdapter});
                                // });
                            }, fail: (res) => {
                                console.log('打开蓝牙Adapter失败', res);
                                log.warn('打开蓝牙Adapter失败', res)
                                this._isOpenAdapter = false;
                                reject(res);
                            }
                        });
                    }, isBugPhone ? 150 : 0);

                })
            } else {
                resolve({isOpenAdapter: this._isOpenAdapter});
            }
        });
    }

    /**
     * 关闭蓝牙适配器
     * @returns {Promise<any>}
     */
    closeAdapter() {
        this._isConnectBindDevice = false;
        return new Promise((resolve, reject) => {
            if (this._isOpenAdapter) {
                this.stopBlueToothDevicesDiscovery().finally(() =>
                    this.closeBLEConnection().finally(() => {
                        wx.closeBluetoothAdapter({
                            success: (res) => {
                                console.log('断开蓝牙Adapter成功', res);
                                this._resetInitData();
                                this._isConnected = false;
                                resolve({isOpenAdapter: this._isOpenAdapter});
                            }, fail: function (res) {
                                console.log('断开蓝牙Adapter失败', res);
                                log.warn('断开蓝牙Adapter失败', res)
                                this._isConnected = false;
                                reject(res);
                            }
                        })
                    })
                );
            } else {
                console.log('closeAdapter already close!!!');
                this._isConnected = false;
                resolve({isOpenAdapter: this._isOpenAdapter});
            }
        })


    }


    /**
     * 清除上一次连接的蓝牙设备
     * 这会导致断开目前连接的蓝牙设备
     * @returns {*|Promise<any>}
     */
    clearConnectedBLE() {
        return new Promise((resolve) => {
            this.closeAdapter().finally(() => {
                wx.removeStorageSync('deviceId');
                this._deviceId = '';
                this.resetConnectTimeout();
                resolve();
            });
        });
    }

    /**
     * 建立蓝牙连接
     * @param deviceId
     * @param signPower
     * @returns {Promise<any>}
     */
    createBLEConnection({deviceId,signPower}) {
        // t开始连接
        this._getEventAndTimestamp({event: 'startLinkTime', signPower});
        return new Promise((resolve, reject) => {
                this.stopBlueToothDevicesDiscovery().finally(() => {
                    if (!this._isConnected) {
                        //蓝牙连接问题暂时处理
                        //this._isConnected = true;
                        let connectionInfo = this.connectionInfo;
                        console.warn('本次连接时设置的超时时间是', connectionInfo.timeout + 's',connectionInfo);
                        console.log('deviceIddeviceIddeviceIddeviceId',deviceId)
                        wx.createBLEConnection({
                            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                            deviceId,
                            timeout: connectionInfo.timeout * 1500,
                            success: (res) => this._findThatCharacteristics({deviceId}).then(() => {
                                // t连接成功
                                this._getEventAndTimestamp({event: 'linkResultTime', status: 1});
                                console.log('蓝牙连接成功', res);
                                var pages = getCurrentPages()    //获取加载的页面
                                var currentPage = pages[pages.length-1]    //获取当前页面的对象
                                console.log('getApp()',getApp().bLEManager,currentPage.route)
                                if(currentPage.route ==='pagesIndex/index/index'){
                                    getApp().bLEManager.startData();
                                    getApp().bLEManager.sendISvalue({isSuccess: true});
                                    console.log('小程序发送了同步状态的指令 和 40-01指令 允许上传在线检测数据')
                                }

                                this._deviceId = deviceId;
                                this._isConnected = true;
                                this.resetConnectTimeout();
                                resolve({isConnected: this._isConnected});
                            }).catch((res) => {
                                console.log('createBLEConnection-catch',res)
                                this._getEventAndTimestamp({event: 'linkResultTime', status: 0});
                                this._isConnected = false;
                                reject(res);
                            }),
                            fail: res => {
                                // t连接失败
                                this._getEventAndTimestamp({event: 'linkResultTime', status: 0});
                                console.log('蓝牙连接失败', res);
                                log.warn('蓝牙连接失败', res)
                                this._isConnected = false;
                                const errCode = res.errCode;
                                if (errCode === 10003 || errCode === 10012) {
                                    if (++connectionInfo.index >= connectionInfo.count) {
                                        connectionInfo.index = connectionInfo.count;
                                    }
                                    connectionInfo.timeout = (connectionInfo.index) * 15;
                                    console.log('下次蓝牙连接的超时时间', connectionInfo.timeout, connectionInfo.index);
                                }
                                reject(res);
                            }
                        });
                    } else {
                        console.log('createBLEConnection already create!!!');
                        resolve();
                    }
                });
            }
        );
    }

    resetConnectTimeout() {
        let connectionInfo = this.connectionInfo;
        connectionInfo.index = 1;
        connectionInfo.timeout = INIT_TIMEOUT;
    }

    /**
     * 断开处于连接状态的蓝牙连接
     * @returns {Promise<any>}
     */
    closeBLEConnection() {
        return new Promise((resolve, reject) => {
                // this.stopBlueToothDevicesDiscovery().finally(() => {
                this._isActiveCloseBLE = true;
                if (this._isConnected && this._deviceId) {
                    this._isConnected = false;
                    wx.closeBLEConnection({
                        deviceId: this._deviceId,
                        success: res => {
                            console.log('断开连接成功', res);
                            this.resetConnectTimeout();
                            resolve();
                        }, fail: res => {
                            console.log('断开连接失败', res);
                            log.warn('断开连接失败', res)
                            const errCode = res.errCode;
                            if (errCode === 10000 || errCode === 10001) {
                                resolve();
                            } else {
                                reject(res);
                            }

                        }
                    });
                } else {
                    this._isConnected = false;
                    console.log('closeBLEConnection already close!!!');
                    resolve();
                }
                // });

            }
        )
    }

    /**
     * 设置UUID数组
     * 这会让你在扫描蓝牙设备时，只保留该UUID数组的蓝牙设备，过滤掉其他的所有设备，提高扫描效率
     * @param services
     * @param hiServiceUUID
     */
    setUUIDs({services, hiServiceUUID}) {
        this._hiServiceUUID = hiServiceUUID;
        if (Array.isArray(services)) {
            this.UUIDs = services;
        } else {
            AbstractBlueTooth._throwUUIDsIsNotArrayError();
        }
    }

    /**
     * 发送二进制数据
     * @param buffer ArrayBuffer
     * @returns {Promise<any>}
     */
    sendData({buffer}) {
        return new Promise((resolve, reject) => {
            wx.writeBLECharacteristicValue({
                deviceId: this._deviceId,
                serviceId: this._serviceId,
                characteristicId: this._characteristicId,
                value: buffer.slice(0, 20),
                success: resolve,
                fail: reject
            })
        })
    }

    /**
     * 停止蓝牙扫描
     * @returns {Promise<any>}
     */
    stopBlueToothDevicesDiscovery() {
        console.log('清除扫描周边设备定时', this._startDiscoveryTimeoutIndex);
        clearTimeout(this._startDiscoveryTimeoutIndex);
        this._isActiveCloseDiscovery = true;
        return new Promise((resolve, reject) => {
            if (this._isStartDiscovery) {
                wx.stopBluetoothDevicesDiscovery({
                    success: () => {
                        this._isStartDiscovery = false;
                        resolve({isStartDiscovery: this._isStartDiscovery});
                    }, fail: reject
                });
            } else {
                resolve({isStartDiscovery: this._isStartDiscovery});
            }
        });

    }


    /**
     * 开启蓝牙扫描
     * @returns {Promise<any>}
     */
    _startBlueToothDevicesDiscovery() {
        this._isActiveCloseDiscovery = false;
        return new Promise((resolve, reject) => {
            if (!this._isStartDiscovery) {
                // t开始扫描
                this._getEventAndTimestamp({event: 'startScanTime'});
                wx.startBluetoothDevicesDiscovery({
                    services: this.UUIDs,
                    allowDuplicatesKey: true,
                    interval: 10,
                    success: () => {
                        console.log('开始扫描蓝牙设备');
                        this._isStartDiscovery = true;
                        resolve({isStartDiscovery: this._isStartDiscovery});
                    }, fail: reject
                });
            } else {
                resolve({isStartDiscovery: this._isStartDiscovery});
            }
        });
    }

    startBlueToothDevicesDiscovery() {
        return this._startBlueToothDevicesDiscovery().then(() => {
            return new Promise((resolve, reject) => {
                clearTimeout(this._startDiscoveryTimeoutIndex);
                this._startDiscoveryTimeoutIndex = setTimeout(() => {
                    !this._isConnected && this.stopBlueToothDevicesDiscovery().then(() => {
                        const now = ``;
                        this._getEventAndTimestamp({event: 'startLinkTime', time: now});
                        this._getEventAndTimestamp({event: 'linkResultTime', status: 0, time: now});
                        reject(ErrorState.DISCOVER_TIMEOUT);
                    });
                }, 60000);
            });
        })
    }

    /**
     * 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备
     * @returns {Promise<any>}
     */
    getBlueToothDevices() {
        return new Promise(((resolve, reject) => wx.getBluetoothDevices({
            success: resolve, fail: reject
        })));
    }

    /**
     * 根据 uuid 获取处于已连接状态的设备。
     * @returns {Promise<any>}
     */
    getConnectedBlueToothDevices() {
        if (!Array.isArray(this.UUIDs)) {
            AbstractBlueTooth._throwUUIDsIsNotArrayError();
        }
        return new Promise((resolve, reject) =>
            wx.getConnectedBluetoothDevices({
                services: this.UUIDs,
                success: resolve, fail: reject
            }));
    }

    _findThatCharacteristics({deviceId}) {
        // return new Promise(((resolve, reject) => {
        return this._getBLEDeviceServices({deviceId}).then(({services}) => {

            for (let i = 0, length = services.length; i < length; i++) {
                let serverItem = services[i];
                if (serverItem.isPrimary && serverItem.uuid.toUpperCase() === this._hiServiceUUID) {
                    console.log('自己的服务', serverItem);
                    // 操作之前先监听，保证第一时间获取数据
                    wx.onBLECharacteristicValueChange((res) => {
                        if (!this._receiveDataOutsideistener) {
                            this._receiveDataInsideListener({receiveBuffer: res.value});
                        } else {
                            this._receiveDataOutsideistener(res);
                        }
                    });
                    return this._getBLEDeviceCharacteristics({deviceId, serviceId: serverItem.uuid});
                }
            }
        }).then(({characteristics, serviceId}) => {
            let read = -1, notify = -1, write = -1;
            for (let i = 0, len = characteristics.length; i < len; i++) {
                let item = characteristics[i], properties = item.properties, uuid = item.uuid;
                if (notify === -1 && (properties.notify || properties.indicate)) {
                    wx.notifyBLECharacteristicValueChange({
                        deviceId,
                        serviceId,
                        characteristicId: uuid,
                        state: true,
                    });
                    notify = i;
                }
                if (read === -1 && (properties.read)) {
                    read = i;
                    wx.readBLECharacteristicValue({
                        deviceId,
                        serviceId,
                        characteristicId: uuid,
                    });
                }
                if (read !== i && write === -1 && properties.write) {
                    write = i;
                    this._serviceId = serviceId;
                    this._characteristicId = uuid;
                    this.setDeviceMacAddress({macId: deviceId});
                }
            }
            // resolve();
        });
        //     .catch((error) => {
        //     console.log('_findThatCharacteristics log', error);
        //     // reject();
        // });
        // }));

    }

    _getBLEDeviceServices({deviceId}) {
        return new Promise((resolve, reject) =>
            wx.getBLEDeviceServices({
                // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                deviceId,
                success(res) {
                    const {services} = res;
                    console.log('device services:', services);
                    resolve({services});
                }, fail: reject
            })
        );
    }

    _getBLEDeviceCharacteristics({deviceId, serviceId}) {
        return new Promise((resolve, reject) =>
            wx.getBLEDeviceCharacteristics({
                // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                deviceId,
                // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
                serviceId,
                success(res) {
                    const {characteristics} = res;
                    console.log('device getBLEDeviceCharacteristics:', characteristics);
                    resolve({characteristics, serviceId});
                }, fail: reject
            }))
    }

    _resetInitData() {
        this._isOpenAdapter = false;
        this._isStartDiscovery = false;
    }

    static _throwUUIDsIsNotArrayError() {
        throw new Error('the type of services is Array!Please check it out.');
    }


    _getEventAndTimestamp({event, status, time = 0, signPower}) {
        console.log('*********************************getEventAndTimestamp', event);
        const date = time || Date.now();
        let statistics = this.eventStatistics;
        // 开始扫描时间 startScanTime
        // 开始连接时间 startLinkTime
        // 连接结果时间 linkResultTime
        switch (event) {
            case 'startScanTime':
                this.eventStatistics = {'startScanTime': date};
                break;
            case 'startLinkTime':
                this.eventStatistics = {...statistics, 'startLinkTime': date, signalIntensity: signPower};
                break;
            case 'linkResultTime':
                statistics = {
                    ...statistics,
                    'linkResultTime': date,
                    status,
                    mac: this.getDeviceMacAddress(),
                    scenes: mta.ScenesHandle.getValue()
                };
                //开始扫描时间戳为空的情况下，将开始连接时间戳赋值给开始扫描时间戳start-----
                let {startScanTime, startLinkTime} = statistics;
                if (!startScanTime) {
                    statistics.startScanTime = startLinkTime;
                }
                //将本次统计数据清空，保证上传统计时，不会对下一次的统计数据造成干扰
                this.eventStatistics = {};
                //开始扫描时间戳为空的情况下，将开始连接时间戳赋值给开始扫描时间戳end-----
                CommonProtocol.postBluetoothCreate({
                    data: statistics
                }).then(data => {
                    const timeOne = (statistics['startLinkTime'] - statistics['startScanTime']) / 1000;
                    const timeTwo = (statistics['linkResultTime'] - statistics['startLinkTime']) / 1000;
                    console.log(`统计结果已上传，扫描时长=${timeOne}s，连接时长=${timeTwo}s，信号强度=${statistics.signalIntensity || '无'}，连接成功=${!!status},场景=${mta.ScenesHandle.getValue()}`);
                });
                break;
        }
    }
}
