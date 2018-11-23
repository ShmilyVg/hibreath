import Network from "./network";
import WXDialog from "../../view/dialog";

export default class Login {
    static doLogin() {
        return new Promise((resolve, reject) =>
            this._wxLogin().then(res => {
                    const token = wx.getStorageSync('token');
                    Network.request({url: 'account/login', data: {js_code: res.code, token}})
                        .then(data => {
                            this._setToken({data});
                            resolve();
                        })
                        .catch(res => {
                            console.log('login failed', res);
                            if (res.data) {
                                const {data: {code}} = res;
                                if (code === 2) {
                                    console.log('未注册，请先注册');
                                    return;
                                }
                            }
                            WXDialog.showDialog({title: '糟糕', content: '抱歉，目前小程序无法登录，请稍后重试'});
                        })
                }
            )
        );
    }

    static doRegister({userInfo, encryptedData, iv}) {
        return new Promise((resolve, reject) =>
            this._wxLogin().then(res => {
                const {code} = res;
                Network.request({url: 'account/register', data: {code, encrypted_data: encryptedData, iv}})
                    .then(data => {
                        console.log('获取注册信息', data);
                        this._setToken({data});
                        resolve();
                    })
                    .catch(res => {
                        console.log('register failed:', res);
                        reject(res);
                    })
            })
        )

    }

    static _wxLogin() {
        return new Promise((resolve) =>
            wx.login({
                success: resolve, fail: res => {
                    WXDialog.showDialog({title: '糟糕', content: '抱歉，目前小程序无法登录，请稍后重试'});
                    console.log('wx login failed', res);
                }
            })
        );
    }

    // static _success({userInfo: {nickName, avatarUrl}}) {
    //     const app = getApp();
    //     app.globalData.userInfo.headUrl = avatarUrl;
    //     app.globalData.userInfo.nickName = nickName;
    //     console.log('全局变量', app.globalData);
    // }

    static _setToken({data: {result: {jsessionid}}}) {
        Network.setToken({token: jsessionid});
        wx.setStorage({
            key: 'token',
            data: jsessionid,
        });
    }

}
