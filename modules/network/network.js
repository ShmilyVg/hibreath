import {PostUrl} from "../../utils/config";

let _token, _queue = {};
export default class Network {

    static setToken({token}) {
        _token = token;
    }

    static request({url, data}) {
        return new Promise(function (resolve, reject) {
            wx.request({
                url: PostUrl + url,
                data,
                header: {Authorization: '+sblel%wdtkhjlu', "Cookie": `JSESSIONID=${_token}`},
                method: 'POST',
                success: res => {
                    const {data} = res;
                    if (!!data && 1 === data.code) {
                        resolve(data);
                    } else {
                        reject(res);
                    }
                },
                fail: reject,
                // complete: res => {
                //     console.log(res);
                // },
            });
        });
    }

    // static requestForLogin({url, data}) {
    //     return new Promise(function (resolve, reject) {
    //         wx.request({
    //             url: PostUrl + url,
    //             data,
    //             header: {Authorization: '+sblel%wdtkhjlu', "Cookie": _token},
    //             method: 'POST',
    //             success: res => {
    //                 const {data} = res;
    //                 if (!!data && 1 === data.code) {
    //                     resolve(data);
    //                 } else {
    //                     reject(res);
    //                 }
    //             },
    //             fail: reject,
    //             // complete: res => {
    //             //     console.log(res);
    //             // },
    //         });
    //     });
    // }
    // static resendAll() {
    //     for(let i in _queue){
    //         let temp = _queue[i];
    //     }
    // }
}
