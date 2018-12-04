import BaseBlueToothImp from "../../libs/bluetooth/base/base-bluetooth-imp";

export default class BlueToothState {
    static UNBIND = 'unbind';
    static UNAVAILABLE = BaseBlueToothImp.UNAVAILABLE;
    static DISCONNECT = BaseBlueToothImp.DISCONNECT;
    static CONNECTING = BaseBlueToothImp.CONNECTING;
    static CONNECTED = BaseBlueToothImp.CONNECTED;
    static TIMESTAMP = 'timestamp';//开始预热状态
    static PRE_HOT_START = 'pre_hot_start';//开始预热状态
    static PRE_HOT_FINISH_AND_START_BREATH = 'pre_hot_finish_and_start_breath';//预热完成开始吹气
    static BREATH_FINISH_AND_SUCCESS = 'breath_finish_and_success';//吹气完成返回结果
    static BREATH_RESTART = 'breath_restart';//重新吹气
    static DEVICE_ID_REQUIRE = 'device_id_require';//app请求设备串号
    static DEVICE_ID_GET_SUCCESS = 'device_id_get_success';//设备成功返回串号
    static UNKNOWN = 'unknown';//未知状态
}
