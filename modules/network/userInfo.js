import Protocol from "./protocol";

export default class UserInfo {
    static get() {
        return new Promise((resolve, reject) => wx.getStorage({
            key: 'userInfo', success: data => {
                console.log(data);
                resolve(data);
            }, fail: () => {
                this._postGetUserInfo({resolve, reject});
            }
        }));
    }

    static set({nickName, headUrl, userId}) {
        wx.setStorage({key: 'userInfo', data: {nickName, headUrl, userId}});
    }

    static _postGetUserInfo({resolve, reject}) {
        Protocol.getMemberInfo().then(data => {
            console.log('自己的信息', data);
            this.set({...data});
            resolve(data);
        }).catch(reject);
    }
}
