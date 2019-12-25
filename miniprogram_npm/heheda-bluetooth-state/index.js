module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1564113011129, function(require, module, exports) {
var __TEMP__ = require('state');var CommonProtocolState = __TEMP__['CommonProtocolState'];var CommonConnectState = __TEMP__['CommonConnectState'];

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, 'CommonConnectState', { enumerable: true, get: function() { return CommonConnectState; } });Object.defineProperty(exports, 'CommonProtocolState', { enumerable: true, get: function() { return CommonProtocolState; } });

}, function(modId) {var map = {"state":1564113011130}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1564113011130, function(require, module, exports) {
const CommonConnectState = {
    //蓝牙的常见状态值
    UNBIND: 'unbind',//未绑定
    UNAVAILABLE: 'unavailable',//蓝牙适配器不可用，通常是没有在手机设置中开启蓝牙，或是没有直接或间接调用父类中的openAdapter()
    DISCONNECT: 'disconnect',//蓝牙连接已断开
    CONNECTING: 'connecting',//正在连接蓝牙设备
    CONNECTED: 'connected',//已经正常连接到蓝牙设备
    NOT_SUPPORT: 'not_support',//当前Android系统版本小于4.3
};

const CommonProtocolState = {

    UNKNOWN: 'unknown',//未知状态
    NORMAL_PROTOCOL: 'normal_protocol',//无需处理的协议
    CONNECTED_AND_BIND: 'connected_and_bind',
    QUERY_DATA_START: 'query_data_start',//开始与设备同步数据
    QUERY_DATA_ING: 'query_data_ing',//与设备同步数据状态中
    QUERY_DATA_FINISH: 'query_data_finish',//完成与设备同步数据的状态
    GET_CONNECTED_RESULT_SUCCESS: 'get_connected_result_success',//设备返回连接结果
    SEND_CONNECTED_REQUIRED: 'send_connected_required',//手机发送连接请求
    TIMESTAMP: 'timestamp',//设备获取时间戳
    DORMANT: 'dormant',//设备休眠
    UPDATING: 'updating',//设备升级中
    UPDATE_FINISH: 'update_finish',//设备升级完成
    FIND_DEVICE: 'find_device',//找到了设备
};

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, 'CommonConnectState', { enumerable: true, get: function() { return CommonConnectState; } });Object.defineProperty(exports, 'CommonProtocolState', { enumerable: true, get: function() { return CommonProtocolState; } });



}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1564113011129);
})()
//# sourceMappingURL=index.js.map