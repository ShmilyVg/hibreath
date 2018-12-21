import {CommonConnectState, CommonProtocolState} from "heheda-bluetooth-state";

const ConnectState = {...CommonConnectState};

const ProtocolState = {
    PRE_HOT_START: 'pre_hot_start',//开始预热状态
    PRE_HOT_FINISH_AND_START_BREATH: 'pre_hot_finish_and_start_breath',//预热完成开始吹气
    BREATH_FINISH_AND_SUCCESS: 'breath_finish_and_success',//吹气完成返回结果
    BREATH_RESTART: 'breath_restart',//重新吹气
    ...CommonProtocolState
};

export {
    ConnectState, ProtocolState
}
