module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1564113011131, function(require, module, exports) {
var __TEMP__ = require('./dialog');var WXDialog = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./toast');var Toast = __REQUIRE_DEFAULT__(__TEMP__);

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, 'WXDialog', { enumerable: true, get: function() { return WXDialog; } });Object.defineProperty(exports, 'Toast', { enumerable: true, get: function() { return Toast; } });




}, function(modId) {var map = {"./dialog":1564113011132,"./toast":1564113011133}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1564113011132, function(require, module, exports) {
let _cancelColor = '#000000', _confirmColor = '#D16730';

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = class WXDialog {

    static setConfig({cancelColor, confirmColor}) {
        _cancelColor = cancelColor;
        _confirmColor = confirmColor;
    }


    static showDialog({title = '', content, showCancel = false, cancelText = '取消', cancelColor = _cancelColor, confirmText = '确定', confirmColor = _confirmColor, confirmEvent, cancelEvent, completeEvent}) {
        wx.showModal({
            title,
            content,
            showCancel,
            cancelText,
            confirmText,
            success: res => {
                if (res.confirm) {
                    confirmEvent && confirmEvent();
                } else {
                    cancelEvent && cancelEvent();
                }
            },
            fail: res => {
                console.log(res);
            },
            cancelColor,
            confirmColor,
            complete: completeEvent
        })
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1564113011133, function(require, module, exports) {
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = class Toast {

    static success(title, duration) {
        wx.showToast({
            title: title,
            icon: 'success',
            duration: !!duration ? duration : 2000,
        })
    }

    static warn(title, duration) {
        wx.showToast({
            title: title,
            duration: !!duration ? duration : 2000,
            image: '/images/loading_fail.png'
        })
    }

    static showLoading(text) {
        wx.showLoading({
            title: text || '请稍后...',
            mask: true
        })
    }

    static hiddenLoading() {
        setTimeout(()=>{
          wx.hideLoading();
        },500)
    }

    static hiddenToast() {
        wx.hideToast();
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1564113011131);
})()
//# sourceMappingURL=index.js.map
