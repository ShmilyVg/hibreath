import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import Toast from "../../view/toast";
import HiNavigator from "../../navigator/hi-navigator";


const app = getApp();

Page({
    data: {
        userInfo: {},
        userInfoShow: true,
        urlList:[
            {title:"身体评估",icon:"../../images/device-bind/connected.png"},
            {title:"检测记录",icon:"../../images/device-bind/connected.png"},
            {title:"体重体脂记录",icon:"../../images/device-bind/connected.png"},
            {title:"我的燃脂精灵",icon:"../../images/device-bind/connected.png"}
        ]
    },

    onLoad() {
        app.onGetUserInfo = ({userInfo}) => this.setData({userInfo});
        let info = app.globalData.userInfo;
        console.log(info,"12312")
        if (info) {
            this.setData({
                userInfo: info
            })
        }

    },

    onShow() {

    },


    onGetUserInfoEvent(e) {
        const {detail: {userInfo, encryptedData, iv}} = e;
        if (!!userInfo) {
            Toast.showLoading();
            Login.doRegister({
                userInfo,
                encryptedData,
                iv
            })
                .then(() => UserInfo.get())
                .then(({userInfo}) => !this.setData({userInfo}) && HiNavigator.navigateToDeviceBind())
                .catch(() => setTimeout(Toast.warn, 0, '获取信息失败')).finally(Toast.hiddenLoading);
        }
    },
    clickBody() {
        HiNavigator.navigateToclickBody();
    },
    clickCheck() {
        HiNavigator.navigateToclickCheck();
    },

    clickMine() {
        HiNavigator.navigateToclickMine();
    },
    onUnload() {

    },


});
