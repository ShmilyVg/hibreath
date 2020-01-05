import {WXDialog} from "heheda-common-view";
import {NetworkConfig} from "../config";
const log = require('../../../../../log.js')
let _token = '', _queue = {}, divideTimestamp = 0;
let _xtoken = null;

export default class BaseNetworkImp {

    static setToken({token, xtoken}) {
        _token = token;
        _xtoken = xtoken;
    }

    static request({url, data, requestWithoutLogin = false, showResendDialog}) {
        return new Promise(function (resolve, reject) {
            const requestObj = {
                url: NetworkConfig.getPostUrl() + url,
                data,
                header: {Authorization: '+sblel%wdtkhjlu', "Cookie": `JSESSIONID=${_token}`, 'X-Token': _xtoken},
                method: 'POST',
                success: res => {
                    const {data} = res;
                    if (!!data && 1 === data.code) {
                        console.log('协议正常', url, data);
                        resolve(data);
                    } else {
                        console.log('协议错误', url, res);
                        log.warn('协议错误', url, res);
                        reject(res);
                    }
                },
                fail: (res) => {
                    console.log('协议错误', url, res);
                    log.warn('协议错误', url, res);
                    const errMsg = res.errMsg;
                    if (showResendDialog && (errMsg.indexOf("No address associated") !== -1 || errMsg.indexOf('已断开与互联网') !== -1 || errMsg.indexOf('request:fail socket time out timeout') !== -1 || errMsg.indexOf('request:fail timeout') !== -1 || errMsg.indexOf('unknow host error') !== -1)) {
                        BaseNetworkImp.addProtocol({url, requestObj});
                        BaseNetworkImp._dealTimeout({url, requestObj});
                    } else {
                        reject(res);
                    }
                },
            };
            /*
            * 所有分享页面单独处理 不需要登录
            * */
            setTimeout(()=>{
                var pages = getCurrentPages()    //获取加载的页面
                var currentPage = pages[pages.length-1]    //获取当前页面的对象
                var isSharepage = false
                var sharePage = ['pages/lowFatReport/lowFatReport','pages/taskShareInfo/taskShareInfo','pages/shareAddcommunity/shareAddcommunity','pages/reductionList/reductionList','pages/punchList/punchList','pagesIndex/planfinish/planfinish']
                if(currentPage){
                    for(var i =0;i<sharePage.length;i++){
                        if(currentPage !==[]){
                            if(currentPage.route === sharePage[i]){
                                isSharepage =true
                            }
                        }
                    }
                    console.log('是否为分享页面',isSharepage)
                    if (!!_token || requestWithoutLogin || isSharepage) {
                        wx.request(requestObj);
                    } else {
                        wx.hideLoading();
                        BaseNetworkImp.addProtocol({url, requestObj});
                    }
                }else{
                    if (!!_token || requestWithoutLogin) {
                        wx.request(requestObj);
                    } else {
                        BaseNetworkImp.addProtocol({url, requestObj});

                    }
                }

            },10)

        });
    }

    static addProtocol({url, requestObj}) {
        console.log('协议发送失败，被加到队列中', url, requestObj);
        _queue[url] = requestObj;
    }

    static resendAll() {
        let requestObj;
        console.log('重发', _queue);
        for (let key in _queue) {
            if (_queue.hasOwnProperty(key)) {
                requestObj = _queue[key];
                requestObj.header = {Authorization: '+sblel%wdtkhjlu', "Cookie": `JSESSIONID=${_token}`, 'X-Token': _xtoken};
                wx.request(requestObj);
            }
        }
        _queue = {};
    }

    static _dealTimeout({url, requestObj}) {
        _queue[url] = requestObj;
        const now = Date.now();
        if (now - divideTimestamp > 2000) {
            WXDialog.showDialog({
                content: '网络异常，请重试', showCancel: true, confirmText: '重试', confirmEvent: () => {
                    divideTimestamp = 0;
                    BaseNetworkImp.resendAll();
                }, cancelEvent: () => {
                    divideTimestamp = 0;
                    if (_queue && _queue.url) {
                        _queue.url.fail({errMsg: 'network request resend cancel'});
                        delete _queue.url;
                    }
                }
            });
        }
        divideTimestamp = now;
    }
}
