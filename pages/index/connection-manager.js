import BlueToothState from "../../modules/bluetooth/state-const";

export default class ConnectionManager {
    constructor(page) {
        this._page = page;
        this.action = {};
        this.action[BlueToothState.DISCONNECT] = () => {
            this.disconnect(page);
        };

        this.action[BlueToothState.CONNECTED] = ()=>{
            this.connected();
        };
    }

    unBind() {
        this._page.setData({
            state: "unbind",
            message: '未绑定设备',
            stateBtn:'点击绑定设备',
            note: this._page.data.noteListMore,
            stateBtnShow: true,
            setShow: false,
            unitShow: false,
            homeBottom:true,
            box3StateIndex:0,
            box4StateIndex:0
        })
    }

    disconnect() {
        this._page.setData({
            message: '未连接到设备',
            stateBtn:'点击重试',
            note: this._page.data.noteListMore,
            stateBtnShow: true,
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
            stateBtnShow: false,
            setShow: true,
            unitShow: false,
            homeBottom:true,
            box3StateIndex:1,
            box4StateIndex:0
        })
    }

    connected(){
        this._page.setData({
            message: '已连接',
            state:'短按设备按键开始检测',
            note: this._page.data.noteListMore,
            stateBtnShow: false,
            setShow: true,
            unitShow: false,
            homeBottom:true,
            box3StateIndex:2,
            box4StateIndex:1
        })
    }
}