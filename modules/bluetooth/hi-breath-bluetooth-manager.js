import SimpleBlueToothImp from "../../libs/bluetooth/simple-bluetooth-imp";
import BaseBlueToothImp from "../../libs/bluetooth/base/base-bluetooth-imp";

export default class HiBreathBlueToothManager extends SimpleBlueToothImp {
    static UNAVAILABLE = BaseBlueToothImp.UNAVAILABLE;
    static DISCONNECT = BaseBlueToothImp.DISCONNECT;
    static CONNECTING = BaseBlueToothImp.CONNECTING;
    static CONNECTED = BaseBlueToothImp.CONNECTED;
    static PRE_HOT_START = 'pre_hot_start';//开始预热状态
    static PRE_HOT_FINISH_AND_START_BREATH = 'pre_hot_finish_and_start_breath';//预热完成开始吹气
    static BREATH_FINISH_AND_SUCCESS = 'breath_finish_and_success';//吹气完成返回结果
    static BREATH_RESTART = 'breath_restart';//重新吹气

    constructor() {
        super();
        this._isFirstReceive = true;
        this.setUUIDs({services: ['6E400001-B5A3-F393-E0A9-E50E24DCCA9E']});//设置主Services方式如 this.setUUIDs({services: ['xxxx']})  xxxx为UUID全称，可设置多个
    }

    /**
     * 发送数据细节的封装
     * 这里根据你自己的业务自行实现
     * @param buffer
     */
    sendData({buffer}) {
        if (buffer && buffer.byteLength) {
            super.sendData({buffer}).then(res => {
                console.log('writeBLECharacteristicValue success成功', res.errMsg);
                const dataView = new DataView(buffer, 0);
                const byteLength = buffer.byteLength;
                for (let i = 0; i < byteLength; i++) {
                    console.log(dataView.getUint8(i));
                }
            }).catch(res => console.log(res));
        } else {
            console.log('发送的buffer是空');
        }
    }

    /**
     * 断开蓝牙连接
     * @returns {PromiseLike<boolean | never> | Promise<boolean | never>}
     */
    disconnect() {
        return super.disconnect().then(() => this._isFirstReceive = true);
    }

    /**
     * 关闭蓝牙适配器
     * 调用此接口会先断开蓝牙连接，停止蓝牙设备的扫描，并关闭蓝牙适配器
     * @returns {PromiseLike<boolean | never> | Promise<boolean | never>}
     */
    closeAll() {
        return super.closeAll().then(() => this._isFirstReceive = true);
    }

    /**
     * 处理从蓝牙设备接收到的数据的具体实现
     * 这里会将处理后的数据，作为参数传递给setBLEListener的receiveDataListener监听函数。
     * @param result ArrayBuffer类型 接收到的数据的最原始对象，该参数为从微信的onBLECharacteristicValueChange函数的回调参数
     * @returns {*}
     */
    dealReceiveData({result}) {
        if (this._isFirstReceive) {
            this._isFirstReceive = false;
            this._firstHandResponse();
        } else {
            //在这里是将接收到的数据，在队尾添加了总和及数据长度，又发送给了蓝牙设备。
            const byteLength = result.value.byteLength;
            const receiverDataView = new DataView(result.value, 0);
            const sendBuffer = new ArrayBuffer(byteLength + 2);
            const sendDataView = new DataView(sendBuffer, 0);
            let count = 0, temp;
            for (let k = 0; k < byteLength; k++) {
                temp = receiverDataView.getUint8(k);
                sendDataView.setUint8(k, temp);
                count += temp;
            }
            console.log('和', count, '长度', byteLength);
            count = count % 128;
            sendDataView.setUint8(byteLength, count);
            sendDataView.setUint8(byteLength + 1, byteLength);
            this.sendData({buffer: sendBuffer});
        }
        HiBreathBlueToothManager.logReceiveData({result});
        //这里的result已经是拥有了总和及数据长度的一个ArrayBuffer了，这里应该是返回与UI层的渲染相关的数据，所以我这里是一个错误的演示
        return {finalResult: result};
    }

    /**
     * 第一次连接成功时，程序会主动发送本机的时间戳给蓝牙设备
     * @private
     */
    _firstHandResponse() {
        const str = Date.now().toString();
        let strArray = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            strArray[i] = str.charCodeAt(i);
        }
        const array = new Uint8Array(strArray.length);
        strArray.forEach((item, index) => array[index] = item);
        this.sendData({buffer: array.buffer})
    }

    /**
     * 打印接收到的数据
     * @param result
     */
    static logReceiveData({result}) {
        const byteLength = result.value.byteLength;
        // const buffer = new ArrayBuffer(byteLength);
        const dataView = new DataView(result.value, 0);
        for (let k = 0; k < byteLength; k++) {
            console.log(`接收到的数据索引：${k} 值：${dataView.getUint8(k)}`);
        }
    }
};
