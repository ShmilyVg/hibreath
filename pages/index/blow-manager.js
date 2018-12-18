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

        this.actionBlow[ProtocolState.BREATH_RESTART] = ()=>{
            this.disblow();
        };

    }

    ready() {
        this._page.setData({
            message: '0',
            state:'预热中',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottom:false,
            homeBottomHide:true,
            box3StateIndex:3,
            box4StateIndex:2
        })
    }

    blow() {
        this._page.setData({
            message: '0',
            state:'请现在对准吹气口吹气',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottom: false,
            homeBottomHide: false,
            box3StateIndex:3,
            box4StateIndex:2,
        });
    }

    disblow() {
        this._page.setData({
            message: '0',
            state:'请现在对准吹气口吹气',
            bindBtnShow: false,
            disconnectBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottom: false,
            homeBottomHide: false,
            box3StateIndex:3,
            box4StateIndex:2,
        })
    }

}
