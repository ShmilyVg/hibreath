import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";

export default class UpdataManager {
    constructor(page) {
        this._page = page;
        this.actionBlow = {};
        this.actionBlow[ProtocolState.UPDATING] = () => {
            this.updating();
        };

        this.actionBlow[ProtocolState.UPDATE_FINISH] = () => {
            this.updataFinish();
        };

    }

    updating(){
        this._page.setData({

            burnupShow: true,
            userInfoShow: false,
            headerRight: false,

            state: "设备已连接",
            stateColorIndex: 1,

            picState: true,
            picStateUrl:'../../images/index/up.png',
            homeHeartBoxIndex: 1,

            connectpicShow: false,
            blowpicShow: false,

            homePointFirst: false,
            homePointSecond: false,

            homeBtn: false,

            homeTitle: true,
            homeTitleText: "设备正在升级",

            homePShow: true,
            marginLeft: "226rpx",

            homeOrangeBtn: false,
        })
    }

    updataFinish(){
        this._page.setData({

            burnupShow: true,
            userInfoShow: false,
            headerRight: false,

            state: "设备已连接",
            stateColorIndex: 1,

            picState: true,
            picStateUrl:'../../images/index/done.png',
            homeHeartBoxIndex: 1,

            connectpicShow: false,
            blowpicShow: false,

            homePointFirst: false,
            homePointSecond: false,

            homeBtn: false,

            homeTitle: true,
            homeTitleText: "升级成功",

            homePShow: false,

            homeOrangeBtn: true,
            homeOrangeBtnText: "立即使用"

        })
    }
}