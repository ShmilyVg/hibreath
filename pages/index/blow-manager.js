import HiNavigator from "../../navigator/hi-navigator";
import BlueToothState from "../../modules/bluetooth/state-const";

export default class BlowManager {
    constructor(page) {
        this._page = page;
        this.actionBlow = {};
        this.actionBlow[BlueToothState.PRE_HOT_START] = () => {
            this.ready();
        };

        this.actionBlow[BlueToothState.PRE_HOT_FINISH_AND_START_BREATH] = () => {
            this.blow();
        };

        this.actionBlow[BlueToothState.BREATH_RESTART] = ()=>{
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
