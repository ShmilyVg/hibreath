/**
 * @Date: 2019-09-25 19:38:46
 * @LastEditors: 张浩玉
 */
export default class IndexCommonManager {
    constructor(page) {
        this._page = page;
    }
    setSearchingState() {
        getApp().getBLEManager().checkLocationPermission();
        this._page.setData({

            btnState: false,

            homeTitle: true,
            homeTitleText: "正在寻找您的设备",
            nofind: false,//未找到标志位 true为未找到
            homeOrangeBtn: false,
        })
    }

    setSearchedState() {
        getApp().getBLEManager().checkLocationPermission();
        this._page.setData({

            btnState: false,
            homeTitle: true,
            homeTitleText: "已找到您的设备",
            nofind: false,
            homeOrangeBtn: false,
        })

        // var that = this;
        // let countDownNum =5
        // setInterval(function () {
        //     countDownNum--;
        //     if ( countDownNum == 0) {
        //         clearInterval();
        //         that.setDissearchState()
        //     }
        // }, 1000)

    }

    setDissearchState() {
        getApp().getBLEManager().checkLocationPermission();
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#EE6F69',
        })
        this._page.setData({
            nofind: true,
            bgColor:"#EE6F69",


            btnState: false,

            homeTitle: true,
            homeTitleText: "绑定失败，请检查后重试",

            marginLeft: "102rpx",
            homeOrangeBtn: true,
        })
    }

};
