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

            burnupShow: false,
            userInfoShow: true,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",
            stateColorIndex: 1,

            picState: false,
            textState:'',
            homeHeartBoxIndex: 1,

            connectpicShow: true,
            blowpicShow: false,

            homePointFirst: true,
            homePointSecond: false,

            homeBtn: true,

            homeTitle: false,
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

    ready() {
        this._page.setData({

            burnupShow: false,
            userInfoShow: true,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",
            stateColorIndex: 1,

            picState: false,
            textState:'预热中',
            homeHeartBoxIndex: 1,

            connectpicShow: false,
            blowpicShow: false,

            homePointFirst: true,
            homePointSecond: false,

            homeBtn: false,

            homeTitle: false,
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

    blow() {
        this._page.setData({

            burnupShow: false,
            userInfoShow: true,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",
            stateColorIndex: 1,

            picState: false,
            textState:'',
            homeHeartBoxIndex: 1,

            connectpicShow: false,
            blowpicShow: true,

            homePointFirst: false,
            homePointSecond: true,

            homeBtn: false,

            homeTitle: false,
            homePShow: false,
            homeOrangeBtn: false,
        });
    }

    disblow() {
        this._page.setData({

            burnupShow: false,
            userInfoShow: true,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",
            stateColorIndex: 1,

            picState: false,
            textState:'',
            homeHeartBoxIndex: 1,

            connectpicShow: false,
            blowpicShow: true,

            homePointFirst: false,
            homePointSecond: true,

            homeBtn: false,

            homeTitle: false,
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

    blowing() {
        this._page.setData({

            burnupShow: false,
            userInfoShow: true,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",
            stateColorIndex: 1,

            picState: false,
            textState:'吹气中',
            homeHeartBoxIndex: 2,

            connectpicShow: false,
            blowpicShow: false,

            homePointFirst: false,
            homePointSecond: true,

            homeBtn: false,

            homeTitle: false,
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

    blowed() {
        this._page.setData({

            burnupShow: false,
            userInfoShow: true,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",
            stateColorIndex: 1,

            picState: true,
            picStateUrl:'../../images/index/note.png',
            homeHeartBoxIndex: 1,

            connectpicShow: false,
            blowpicShow: false,

            homePointFirst: false,
            homePointSecond: false,

            homeBtn: false,

            homeTitle: true,
            homeTitleText: "吹起完成，正在生成结果",
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

}
