//app.js
import 'libs/adapter';
import 'modules/network/update';
import UserInfo from "./modules/network/userInfo";
import Login from "./modules/network/login";

App({
    onLaunch() {
        this.doLogin();
    },

    doLogin() {
        Login.doLogin().then(() => UserInfo.get()).then(({userInfo}) => {
        });
    },
    globalData: {
        userInfo: {nickname: '', headUrl: '', id: 0}
    }
});
