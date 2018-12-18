import {CommonConnectState, CommonProtocolState} from "../../libs/bluetooth/base/state";

export class ConnectState extends CommonConnectState {
    static UNBIND = 'unbind';
}

export class ProtocolState extends CommonProtocolState {
    static PRE_HOT_START = 'pre_hot_start';//开始预热状态
    static PRE_HOT_FINISH_AND_START_BREATH = 'pre_hot_finish_and_start_breath';//预热完成开始吹气
    static BREATH_FINISH_AND_SUCCESS = 'breath_finish_and_success';//吹气完成返回结果
    static BREATH_RESTART = 'breath_restart';//重新吹气
}
