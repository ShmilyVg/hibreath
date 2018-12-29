import WXDialog from "../../view/dialog";
import {ConnectState} from "../../modules/bluetooth/bluetooth-state";

export default class ConnectionManager {
    constructor(page) {
        this._page = page;
        this._timeoutIndex = 0;
        this.action = {};
        this.action[ConnectState.UNBIND] = () => {
            this.unbind();
        };

        this.action[ConnectState.UNAVAILABLE] = () => {
            clearTimeout(this._timeoutIndex);
            this._timeoutIndex = setTimeout(() => {
                WXDialog.showDialog({title: 'TIPS', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
                this.disconnect();
            },200);
        };
            this.action[ConnectState.DISCONNECT] = () => {
            this.disconnect();
        };

        this.action[ConnectState.CONNECTING] = ()=>{
            this.connecting();
        };

    }

    unbind() {
        this._page.setData({
            bindBtn:'点击绑定设备',
            note: this._page.data.noteListMore,
            bindBtnShow: true,
            disconnectBtnShow: false,
            setShow: false,
            homePoint: true,
            homeBtn: true,
            homeHint: false,
            box3StateIndex:0,
            box4StateIndex:0,
            bindList:[]
        })
    }

    disconnect() {
        this._page.setData({
            disconnect:'未连接设备\n点击重试',
            note: this._page.data.noteListMore,
            bindBtnShow: false,
            disconnectBtnShow: true,
            setShow: true,
            homePoint: true,
            homeBtn: true,
            homeHint: false,
            box3StateIndex:0,
            box4StateIndex:0
        });
    }

    connecting() {
        this._page.setData({
            state:'正在连接设备',
            note: this._page.data.noteListMore,
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: true,
            homePoint: true,
            homeBtn: true,
            homeHint: false,
            stateColorIndex: 0,
            stateLineheightIndex: 0,
            box3StateIndex:1,
            box4StateIndex:0
        })
    }

}
