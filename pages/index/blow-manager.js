import HiNavigator from "../../navigator/hi-navigator";
import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";


export default class BlowManager {
    constructor(page) {
        this._page = page;
        this.actionBlow = {};
        this.actionBlow[ProtocolState.PRE_HOT_START] = () => {
            this.ready();
            this.timer()

        };

        this.actionBlow[ProtocolState.PRE_HOT_FINISH_AND_START_BREATH] = () => {
            this.blow();
            page.picAnimation();
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
                    page.picAnimation();
                };
    }
    timer(){
        var that = this;
         let countDownNum =5
         setInterval(function () {
             countDownNum--;
             if ( countDownNum == 0) {
                 clearInterval();
                 that._page.setData({
                     homePointHot: true
                 })
             }
         }, 1000)

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
            btnState: false,
            hintPic: true,
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
            btnState: false,
            hintPic: true,
            textState:'预热中',
            homeHeartBoxIndex: 1,

            connectpicShow: false,
            blowpicShow: false,

            homePointFirst: false,
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
            btnState: false,
            hintPic: true,
            textState:'',
            homeHeartBoxIndex: 1,
            homePointHot:false, //吹气时 隐藏预热过长文案
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
            btnState: false,
            hintPic: true,
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
            btnState: false,
            hintPic: true,
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
            btnState: false,
            hintPic: true,
            picStateUrl:'../../images/index/note.png',
            textState:'',
            homeHeartBoxIndex: 1,

            connectpicShow: false,
            blowpicShow: false,

            homePointFirst: false,
            homePointSecond: false,

            homeBtn: false,

            homeTitle: true,
            homeTitleText: "吹气完成，正在生成结果",
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

}
