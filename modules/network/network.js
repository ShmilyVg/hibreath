import {PostUrl} from "../../utils/config";
import Login from "./login";

let _token, _queue = {};
export default class Network {

    static setToken({token}) {
        _token = token;
    }

    static request({url, data, requestWithoutLogin = false}) {
        return new Promise(function (resolve, reject) {
            const requestObj = {
                url: PostUrl + url,
                data,
                header: {Authorization: '+sblel%wdtkhjlu', "Cookie": `JSESSIONID=${_token}`},
                method: 'POST',
                success: res => {
                    const {data} = res;
                    if (!!data && 1 === data.code) {
                        resolve(data);
                    } else if (data.code === 9) {
                        setTimeout(() => {
                            _queue[url] = requestObj;
                            Login.doLogin();
                        }, 2000);
                        return;
                    }
                    reject(res);
                },
                fail: reject,
            };
            if (!!_token || requestWithoutLogin) {
                wx.request(requestObj);
            } else {
                _queue[url] = requestObj;
            }
        });
    }

    static resendAll() {
        let requestObj;
        for (let key in _queue) {
            requestObj = _queue[key];
            requestObj.header.Cookie = `JSESSIONID=${_token}`;
            wx.request(requestObj);
        }
        _queue = {};
    }
}
