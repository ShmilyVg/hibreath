module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1564113011135, function(require, module, exports) {
var __TEMP__ = require('./update');

}, function(modId) {var map = {"./update":1564113011136}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1564113011136, function(require, module, exports) {
var __TEMP__ = require('heheda-common-view');var WXDialog = __TEMP__['WXDialog'];

const updateManager = wx.getUpdateManager();

updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log('检测是否有更新', res.hasUpdate)
});

updateManager.onUpdateReady(function () {
    WXDialog.showDialog({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        confirmEvent: () => updateManager.applyUpdate()
    });
});

updateManager.onUpdateFailed(function (res) {
    // 新版本下载失败
    console.log('更新失败', res);
});

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1564113011135);
})()
//# sourceMappingURL=index.js.map