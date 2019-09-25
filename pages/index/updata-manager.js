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

            headerRight: false,

            state: "设备已连接",

            btnState: false,


            blowpicShow: false,



            homeTitle: true,
            homeTitleText: "设备正在升级",

            marginLeft: "226rpx",

            homeOrangeBtn: false,
        })
    }

    updataFinish(){
        this._page.setData({


            headerRight: false,

            state: "设备已连接",

            btnState: false,

            blowpicShow: false,


            homeTitle: true,
            homeTitleText: "升级成功",

            homeOrangeBtn: true,
            homeOrangeBtnText: "立即使用"

        })
    }
}
