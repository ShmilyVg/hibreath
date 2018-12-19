import WXDialog from "../../view/dialog";
import {ConnectState, ProtocolState} from "../../modules/bluetooth/bluetooth-state";

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
            state: "unbind",
            message: '未绑定设备',
            bindBtn:'点击绑定设备',
            note: this._page.data.noteListMore,
            bindBtnShow: true,
            disconnectBtnShow: false,
            setShow: false,
            unitShow: false,
            homeBottom:true,
            box3StateIndex:0,
            box4StateIndex:0,
            bindList:[]
        })
    }

    disconnect() {
        this._page.setData({
            message: '未连接到设备',
            disconnect:'点击重试',
            note: this._page.data.noteListMore,
            bindBtnShow: false,
            disconnectBtnShow: true,
            setShow: true,
            unitShow: false,
            homeBottom:true,
            box3StateIndex:0,
            box4StateIndex:0
        });
    }

    connecting() {
        this._page.setData({
            message: '正在连接设备',
            state:' ',
            note: this._page.data.noteListMore,
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: true,
            unitShow: false,
            homeBottom:true,
            box3StateIndex:1,
            box4StateIndex:0
        })
    }

}
