//app.js
import 'libs/adapter';
import 'modules/network/update';
import UserInfo from "./modules/network/userInfo";
import Login from "./modules/network/login";

App({
    onLaunch: function () {
        Login.doLogin().then(() => {
            UserInfo.get().then(userInfo => {
                this.globalData.userInfo.nickName = userInfo.nickName;
                this.globalData.userInfo.headUrl = userInfo.headUrl;
                this.globalData.userInfo.userId = userInfo.userId;
            }).catch();
        })
    },

    globalData: {
        userInfo: {nickName: '', headUrl: '', userId: ''}
    }
});
