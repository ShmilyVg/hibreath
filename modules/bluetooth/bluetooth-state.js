import {CommonConnectState, CommonProtocolState} from "heheda-bluetooth-state";

const ConnectState = {...CommonConnectState};

const ProtocolState = {
    KEY_CONFIRM: 'key_confirm',//按键检测
    PRE_HOT_START: 'pre_hot_start',//开始预热状态
    PRE_HOT_FINISH_AND_START_BREATH: 'pre_hot_finish_and_start_breath',//预热完成开始吹气
    BREATH_RESULT: 'breath_result',//吹气完成返回结果
    BREATH_RESTART: 'breath_restart',//重新吹气
    BREATH_START: 'breath_start',//设备发出的开始吹气通知
    BREATH_FINISH: 'breath_finish',//设备发出的吹气完成通知
    ...CommonProtocolState
};

export {
    ConnectState, ProtocolState
}
