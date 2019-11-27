import {HexTools, HiBlueToothProtocol} from "./heheda-bluetooth/index";
import {ProtocolState} from "./bluetooth-state";
import * as tools from "../../utils/tools";
const log = require('../../log.js')
export default class HiBreathBlueToothProtocol extends HiBlueToothProtocol {
    constructor(blueToothManager) {
        super({blueToothManager, deviceIndexNum: 6});
        this.action = {
            ...this.action,
            //按键检测
            '0x3e': () => {
                super.sendData({command: '0x3f'});
                return {state: ProtocolState.KEY_CONFIRM};
            },
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
                /*return {state: ProtocolState.PRE_HOT_START};*/
                  return {state: ProtocolState.BREATH_RESTART};
            },
            //由设备发出的显示结果请求
            '0x36': ({dataArray}) => {
                console.log(dataArray,"77777")
                super.sendData({command: '0x37'});
                const timestamp = HexTools.hexArrayToNum(dataArray.slice(0, 4));
                console.log(timestamp,"时间")
                const dou = HexTools.hexArrayToNum(dataArray.slice(5, 6));
                const finalDou = '0' + Math.floor(dou >= 100 ? dou / 10 : dou);
                const result = HexTools.hexArrayToNum(dataArray.slice(4, 5)) + '.' + finalDou.slice(-2);
                return {state: ProtocolState.BREATH_RESULT, dataAfterProtocol: {result, timestamp}};
            },
            '0x38': () => {
                super.sendData({command: '0x39'});
                return {state: ProtocolState.BREATH_START};
            },
            '0x3a': () => {
                super.sendData({command: '0x3b'});
                return {state: ProtocolState.BREATH_FINISH};
            },
            '0x3c': ({dataArray}) => {
                console.log("查看数据结果",dataArray)
                log.warn("查看数据结果",dataArray)
                /*     const result = HexTools.hexArrayToNum(dataArray.slice(4, 6));*/
                //结果保留一位小数并不四舍五入
                const b = dataArray[4]/10+dataArray[5]/100;
                const result = tools.subStringNum(b);
                console.log('数据2 result',result);
                log.warn("数据2 result",result)
                const timestamp = HexTools.hexArrayToNum(dataArray.slice(0, 4));
                console.log('数据2 timestamp',timestamp);
                const currentLength = HexTools.hexArrayToNum(dataArray.slice(6, 7));
                console.log('数据2 currentLength',currentLength);
                const currentIndex = HexTools.hexArrayToNum(dataArray.slice(7, 9));
                console.log('数据2 currentIndex',currentIndex);

                return {
                    state: ProtocolState.QUERY_DATA_ING,
                    dataAfterProtocol: {timestamp, result, currentLength, currentIndex}
                };
            },
            '0x41': () => {

            }
        }
    }


};

