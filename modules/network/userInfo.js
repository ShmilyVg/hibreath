import Protocol from "./protocol";

export default class UserInfo {
    static get() {
        return new Promise((resolve, reject) => {
            let localUserInfoInMemory = getApp().globalData.userInfo;
            if (!!localUserInfoInMemory && !!localUserInfoInMemory.id) {
                resolve({userInfo: localUserInfoInMemory});
                return;
            }
            wx.getStorage({
                key: 'userInfo', success: data => {
                    console.log('从硬盘中取出userInfo',data);
                    resolve({userInfo: data});
                }, fail: () => {
                    this._postGetUserInfo({resolve, reject});
                }
            });
        });
    }

    static set({nickName, headUrl, userId}) {
        wx.setStorage({key: 'userInfo', data: {nickName, headUrl, userId}});
    }

    static _postGetUserInfo({resolve, reject}) {
        console.log('自己的信息11');

        Protocol.getAccountInfo().then(data => {
            console.log('自己的信息', data);
            this.set({...data});
            resolve({userInfo: data});
        }).catch(reject);
    }
}
