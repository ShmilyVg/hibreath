export default class IndexCommonManager {
    constructor(page) {
        this._page = page;
    }
    setSearchingState() {
        this._page.setData({
            burnupShow: true,

            picState: true,
            btnState: false,
            picStateUrl: '../../images/index/search.png',
            homeHeartBoxIndex: 1,

            homeTitle: true,
            homeTitleText: "正在寻找您的设备",
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

    setSearchedState() {
        this._page.setData({
            burnupShow: true,

            picState: true,
            btnState: false,
            picStateUrl: '../../images/index/done.png',
            homeHeartBoxIndex: 1,

            homeTitle: true,
            homeTitleText: "已找到您的设备",
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

    setDissearchState() {
        this._page.setData({
            burnupShow: true,

            picState: true,
            btnState: false,
            picStateUrl: '../../images/index/warn.png',
            homeHeartBoxIndex: 1,

            homeTitle: true,
            homeTitleText: "绑定失败，请检查后重试",
            homePShow: true,
            marginLeft: "102rpx",
            homeOrangeBtn: true,
        })
    }
};