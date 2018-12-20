import HiBlueToothProtocol from "../../libs/bluetooth/hi-bluetooth-protocol";
import {HexTools} from "../../libs/bluetooth/utils/tools";
import {ProtocolState} from "./bluetooth-state";

export default class HiBreathBlueToothProtocol extends HiBlueToothProtocol {

    constructor(blueToothManager) {
        super({blueToothManager, deviceIndexNum: 6});
        this.action = {
            ...this.action,
            //由设备发出的预热请求
            '0x30': () => {
                super.sendData({command: '0x31'});
                return {state: ProtocolState.PRE_HOT_START};
            },
            //由设备发出的吹气请求
            '0x32': () => {
                super.sendData({command: '0x33'});
                return {state: ProtocolState.PRE_HOT_FINISH_AND_START_BREATH};
            },
            //由设备发出的重新吹气请求
            '0x34': () => {
                super.sendData({command: '0x35'});
                return {state: ProtocolState.BREATH_RESTART};
            },
            //由设备发出的显示结果请求
            '0x36': ({dataArray}) => {
                super.sendData({command: '0x37'});
                const timestamp = HexTools.hexArrayToNum(dataArray.slice(0, 4));
                const result = HexTools.hexArrayToNum(dataArray.slice(-2));
                return {state: ProtocolState.BREATH_FINISH_AND_SUCCESS, dataAfterProtocol: {result, timestamp}};
            },
        }
    }


};


