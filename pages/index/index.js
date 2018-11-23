//index.js
//获取应用实例
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";
import Toast from "../../view/toast";

Page({
    data: {
        userInfo: {}
    },

    onLoad() {

    },

    onGetUserInfoEvent(e) {
        console.log(e);
        Toast.showLoading();
        const {detail: {userInfo, encryptedData, iv}} = e;
        Login.doRegister({
            userInfo,
            encryptedData,
            iv
        })
            .then(() => UserInfo.get())
            .then(({userInfo}) => this.setData({userInfo}))
            .catch(() => setTimeout(() => Toast.warn('获取信息失败'))).finally(() => Toast.hiddenLoading());
    }
});
