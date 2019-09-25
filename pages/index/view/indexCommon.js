export default class IndexCommonManager {
    constructor(page) {
        this._page = page;
    }
    setSearchingState() {
        getApp().getBLEManager().checkLocationPermission();
        this._page.setData({

            picState: true,
            btnState: false,
            hintPic: false,
            picStateUrl: '../../images/index/search.png',
            homeHeartBoxIndex: 1,

            homeTitle: true,
            homeTitleText: "正在寻找您的设备",
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

    setSearchedState() {
        getApp().getBLEManager().checkLocationPermission();
        this._page.setData({
            picState: true,
            btnState: false,
            hintPic: true,
            picStateUrl: '../../images/index/done.png',
            homeHeartBoxIndex: 1,
            homeTitle: true,
            homeTitleText: "已找到您的设备",
            homePShow: false,
            homeOrangeBtn: false,
        })
       /* var that = this;
        let countDownNum =5
        setInterval(function () {
            countDownNum--;
            if ( countDownNum == 0) {
                clearInterval();
                that.setDissearchState()
            }
        }, 1000)*/

    }

    setDissearchState() {
        getApp().getBLEManager().checkLocationPermission();
        this._page.setData({

            picState: true,
            btnState: false,
            hintPic: true,
            picStateUrl: '../../images/index/warn.png',
            homeHeartBoxIndex: 1,

            homeTitle: true,
            homeTitleText: "绑定失败，请检查后重试",
            homePShow: true,
            bgColor:"#EE6F69",
            marginLeft: "102rpx",
            homeOrangeBtn: true,
        })
    }

};
