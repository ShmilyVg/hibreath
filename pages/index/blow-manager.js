import HiNavigator from "../../navigator/hi-navigator";

export default class BlowManager {
    constructor(page) {
        this._page = page;
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