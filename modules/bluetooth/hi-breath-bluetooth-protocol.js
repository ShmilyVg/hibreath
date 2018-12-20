import HiBlueToothProtocol from "../../libs/bluetooth/hi-bluetooth-protocol";
import {HexTools} from "../../libs/bluetooth/utils/tools";
import {ProtocolState} from "./bluetooth-state";

export default class HiBreathBlueToothProtocol extends HiBlueToothProtocol {

    constructor(blueToothManager) {
        super({blueToothManager, deviceIndexNum: 6});
        this.action = {
            ...this.action,
            //由设备发出的预热请求
            '0x72': () => {
                super.sendData({command: '0x73'});
                return {state: ProtocolState.PRE_HOT_START};
            },
            //由设备发出的吹气请求
            '0x74': () => {
                super.sendData({command: '0x75'});
                return {state: ProtocolState.PRE_HOT_FINISH_AND_START_BREATH};
            },
            //由设备发出的重新吹气请求
            '0x76': () => {
                super.sendData({command: '0x77'});
                return {state: ProtocolState.BREATH_RESTART};
            },
            //由设备发出的显示结果请求
            '0x78': ({dataArray}) => {
                super.sendData({command: '0x79'});
                const timestamp = HexTools.hexArrayToNum(dataArray.slice(0, 4));
                const result = HexTools.hexArrayToNum(dataArray.slice(-2));
                return {state: ProtocolState.BREATH_FINISH_AND_SUCCESS, dataAfterProtocol: {result, timestamp}};
            },
            '0x7d': () => {
                super.sendData({command: '0x7e'});
                return {state: ProtocolState.DORMANT};
            }
        }
    }


};


