import HiNavigator from "../../navigator/hi-navigator";
import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";

export default class BlowManager {
    constructor(page) {
        this._page = page;
        this.actionBlow = {};
        this.actionBlow[ProtocolState.PRE_HOT_START] = () => {
            this.ready();
        };

        this.actionBlow[ProtocolState.PRE_HOT_FINISH_AND_START_BREATH] = () => {
            this.blow();
        };

        this.actionBlow[ProtocolState.BREATH_RESTART] = () => {
            this.disblow();
        };

        this.actionBlow[ProtocolState.BREATH_START] = () => {
            this.blowing();
        };

        this.actionBlow[ProtocolState.BREATH_FINISH] = () => {
            this.blowed();
        };

        this.actionBlow[ProtocolState.CONNECTED_AND_BIND] =
            this.actionBlow[ProtocolState.TIMESTAMP] =
                this.actionBlow[ProtocolState.DORMANT] = () => {
                    this.connected();
                };
    }

    connected() {
        this._page.setData({
            message: '已连接',
            state: '短按设备按键开始检测',
            note: this._page.data.noteListMore,
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: true,
            unitShow: false,
            homeBottom: true,
            box3StateIndex: 2,
            box4StateIndex: 1
        })
    }

    ready() {
        this._page.setData({
            message: '0',
            state: '预热中',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottom: false,
            homeBottomHide: true,
            box3StateIndex: 3,
            box4StateIndex: 2
        })
    }

    blow() {
        this._page.setData({
            message: '0',
            state: '请现在对准吹气口吹气',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottom: false,
            homeBottomHide: false,
            box3StateIndex: 3,
            box4StateIndex: 2,
        });
    }

    disblow() {
        this._page.setData({
            message: '0',
            state: '请现在对准吹气口吹气',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottom: false,
            homeBottomHide: false,
            box3StateIndex: 3,
            box4StateIndex: 2,
        })
    }

    blowing() {
        this._page.setData({
            message: '0',
            state: '吹气中...',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottom: false,
            homeBottomHide: false,
            box3StateIndex: 3,
            box4StateIndex: 2,
        })
    }

    blowed() {
        this._page.setData({
            message: '0',
            state: '吹气完成，正在生成结果...',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottom: false,
            homeBottomHide: false,
            box3StateIndex: 3,
            box4StateIndex: 2,
        })
    }

}
