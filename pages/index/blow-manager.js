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

        this.actionBlow[BlueToothState.BREATH_FINISH_AND_SUCCESS] = ()=>{
            this.blowdone();
        };
    }

    ready() {
        this._page.setData({
            message: '0',
            state:'预热中',
            stateBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottomHide:true,
            box3StateIndex:3,
            box4StateIndex:2
        })
    }

    blow() {
        this._page.setData({
            message: '0',
            state:'请现在对准吹气口吹气',
            stateBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottom:false,
            box3StateIndex:3,
            box4StateIndex:2,
        });
    }

    disblow() {
        this._page.setData({
            message: '0',
            state:'请现在对准吹气口吹气',
            stateBtnShow: false,
            setShow: false,
            unitShow: true,
            homeBottom:false,
            box3StateIndex:3,
            box4StateIndex:2,
        })
    }

    blowdone(){
        HiNavigator.navigateTo({url:'/pages/result/result'});
    }
}