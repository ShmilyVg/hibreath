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
            state: '已连接',
            note: this._page.data.noteListMore,
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            homePoint: true,
            homeBtn: true,
            homeHint: true,
            stateColor: 1,
            stateLineheight: 0,
            box3StateIndex: 2,
            box4StateIndex: 1
        })
    }

    ready() {
        this._page.setData({
            state: '预热中',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            homePoint: false,
            homeBtn: false,
            homeHint: false,
            stateColor: 1,
            stateLineheight: 0,
            box3StateIndex: 3,
            box4StateIndex: 2
        })
    }

    blow() {
        this._page.setData({
            state: '请现在\n对准吹气口吹气',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            homePoint: false,
            homeBtn: false,
            homeHint: false,
            stateColor: 0,
            stateLineheight: 1,
            box3StateIndex: 3,
            box4StateIndex: 2,
        });
    }

    disblow() {
        this._page.setData({
            state: '请现在\n对准吹气口吹气',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            homePoint: false,
            homeBtn: false,
            homeHint: false,
            stateColor: 0,
            stateLineheight: 1,
            box3StateIndex: 3,
            box4StateIndex: 2,
        })
    }

    blowing() {
        this._page.setData({
            state: '吹气中',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            homePoint: false,
            homeBtn: false,
            homeHint: false,
            stateColor: 0,
            stateLineheight: 0,
            box3StateIndex: 3,
            box4StateIndex: 2,
        })
    }

    blowed() {
        this._page.setData({
            state: '吹气完成\n正在生成结果',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            homePoint: false,
            homeBtn: false,
            homeHint: false,
            stateColor: 0,
            stateLineheight: 1,
            box3StateIndex: 3,
            box4StateIndex: 2,
        })
    }

}
