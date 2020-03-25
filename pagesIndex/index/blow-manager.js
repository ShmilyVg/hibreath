/**
 * @Date: 2019-09-25 19:38:38
 * @LastEditors: 张浩玉
 */
import HiNavigator from "../../navigator/hi-navigator";
import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import CommonProtocol from "../../modules/network/network/libs/protocol";
import {WXDialog} from "heheda-common-view";
var mta= require('../../utils//mta_analysis.js')

export default class BlowManager {
    constructor(page) {
        this._page = page;
        this.actionBlow = {};
        console.log("ProtocolState",ProtocolState)
        console.log("this.actionBlow",this.actionBlow)
        console.log('this.actionBlow[ProtocolState.BREATH_FINISH]',this.actionBlow[ProtocolState.BREATH_FINISH])
        this.actionBlow[ProtocolState.KEY_CONFIRM] = () => {
            console.log('我在执行按键检测')
            this.connected();
            this.alertUpdata()
        };

        this.actionBlow[ProtocolState.PRE_HOT_START] = () => {
            this.ready();
           /* this.timer(); 预热超过两分钟提示文字暂时去掉*/
        };

        this.actionBlow[ProtocolState.PRE_HOT_FINISH_AND_START_BREATH] = () => {
            this.blow();
        };

        this.actionBlow[ProtocolState.BREATH_RESTART] = () => {
            this.disblow();
            this.distimerblow();
        };

        this.actionBlow[ProtocolState.BREATH_START] = () => {
            this.blowing();
            this.timerblow();
        };

        this.actionBlow[ProtocolState.BREATH_FINISH] = () => {
            setTimeout(() => { this.blowed();},1000)
        };
        this.actionBlow[ProtocolState.CONNECTED_AND_BIND] =
            this.actionBlow[ProtocolState.TIMESTAMP] =
                this.actionBlow[ProtocolState.DORMANT] = () => {
                    this.connected();
                    //page.picAnimation();
                };
        this.actionBlow[ProtocolState.GAS_INTERFERENCE] = () => {
            console.log('气体干扰命令执行了哦');
        };
    }
    //若预热中状态持续＞2分钟，仍然没有进入下一环节，则出现该提示文案
    timer(){
        console.log("预热",  this._page)
         var that = this;
         let countDownNumHot =120
         setInterval(function () {
             countDownNumHot--;
             if(that._page.data.readyimg !==true){
                 clearInterval();
             }else if(countDownNumHot == 0 && that._page.data.readyimg === true){
                 that._page.setData({
                     homePointHot: true
                 })
             }
         }, 1000)
     }

    timerblow(){
        this._page.setData({
            blowNumber: 5
        });
        var that = this;
        let countDownNum =4
        var int=setInterval(function () {
            that._page.setData({
                blowNumber: countDownNum
            })
            countDownNum--;
            if ( countDownNum == 0) {
                clearInterval(int);
            }
        }, 1000)
    }

    distimerblow(){
        this._page.setData({
            disblowNumber: 5
        });
        var that = this;
        let countDownNum =4
        var int=setInterval(function () {
            that._page.setData({
                disblowNumber: countDownNum
            })
            countDownNum--;
            if ( countDownNum == 0) {
                clearInterval(int);
            }
        }, 50)
    }
    alertUpdata(){
            CommonProtocol.postBlueToothUpdate({
                deviceId: wx.getStorageSync('indexDeviceId'),
                version: wx.getStorageSync('indexVersion')
            }).then(data => {
                const {update: isUpdate, zip} = data.result;
                console.log('data.result', data.result);
                if (zip) {
                    const {bin: binArray, dat: datArray} = zip;
                    if (isUpdate && binArray && binArray.length && datArray && datArray.length) {
                        const {url: binUrl, md5: binMd5} = binArray[0];
                        const {url: datUrl, md5: datMd5} = datArray[0];
                        this._page.setData({
                            needCheckOTAUpdate:true,
                            binUrl:binUrl,
                            datUrl:datUrl
                        })

                       /* WXDialog.showDialog({
                            content: '为了给您带来更好的体验\n' + '即将为设备进行升级',
                            showCancel: true,
                            confirmText: "立即升级",
                            cancelText: "暂时不用",
                            confirmEvent: () => {
                                const {url: binUrl, md5: binMd5} = binArray[0];
                                const {url: datUrl, md5: datMd5} = datArray[0];
                                HiNavigator.relaunchToUpdatePage({binUrl, datUrl});
                            },
                            cancelEvent: () => {
                                WXDialog.showDialog({
                                    content: '好的！本次您可以继续正常使用\n' + '下次在按键检测状态将再次提醒',
                                    confirmText: '我知道啦',

                                })
                            }
                        });*/

                    } else {
                        console.log('无需升级');
                    }
                }
            });
    }

    connected() {
        this._page.setData({
            navBarColor:'#000000',//导航字体颜色
            navBarIconTheme:'black',//导航返回键颜色
            navBarBackground:'#FFFFFF',//导航背景色
            tryAgain:false,
            noBind:false,
            finding:false,
            blowpicShow: false,
            bgcolor:"#fff",
            readyimg:false,// 预热图片显示
            blowingImg:false,
            textState:'',
            textStateEn:'',
            disblowImg:false,//吹气不足状态
            process:false,//分析中
            beginFat:true,//连接成功    条件符合弹出升级弹窗
            topState:"开启您的燃脂之旅",
            topStateS:"短按设备按键·开始检测",
            bgColor:"#fff",
            homePointHot:false,
            stateBtnShow: false,
            state: "设备已连接",
            btnState: false,
            homeTitle: false,
            homeOrangeBtn: false,
        })
        console.log("this._pagethis._page",this._page.data.needCheckOTAUpdate)
    }

    ready() {
        this._page.setData({
            navBarColor:'#000000',//导航字体颜色
            navBarIconTheme:'black',//导航返回键颜色
            navBarBackground:'#FFFFFF',//导航背景色
            tryAgain:false,
            needCheckOTAUpdate:false,
            noBind:false,
            stateBtnShow: false,
            state: "设备已连接",
            finding:false,
            btnState: false,


            bgColor:"#fff",
            beginFat:false,
            blowpicShow: false,
            readyimg:true,// 预热图片显示
            blowingImg:false,
            disblowImg:false,//吹气不足状态
            process:false,//分析中
            textState:"",
            textStateEn:'',
            homeTitle: false,
            homeOrangeBtn: false,
        })
    }

    blow() {
        this._page.setData({
            navBarColor:'#000000',//导航字体颜色
            navBarIconTheme:'black',//导航返回键颜色
            navBarBackground:'#FFFFFF',//导航背景色
            tryAgain:false,
            needCheckOTAUpdate:false,
            noBind:false,
            stateBtnShow: false,
            state: "设备已连接",
            btnState: false,
            finding:false,
            bgColor:"#fff",
            beginFat:false,
            blowpicShow: true,//吹气图片显示
            readyimg:false,// 预热图片显示
            blowingImg:false,
            textState:'请吹气',
            textStateEn:'BLOW UP',
            disblowImg:false,//吹气不足状态
            homePointHot:false, //吹气时 隐藏预热过长文案
            process:false,//分析中

            homeTitle: false,
            homeOrangeBtn: false,
        });
    }
    //重新吹气
    disblow() {
        this._page.setData({
            navBarColor:'#000000',//导航字体颜色
            navBarIconTheme:'black',//导航返回键颜色
            navBarBackground:'#FFFFFF',//导航背景色
            tryAgain:false,
            needCheckOTAUpdate:false,
            noBind:false,

            stateBtnShow: false,

            state: "设备已连接",


            btnState: false,

            bgColor:"#fff",
            beginFat:false,
            blowpicShow: false,//吹气图片
            readyimg:false,// 预热图片
            blowingImg:false,
            disblowImg:true,//吹气不足状态
            textState:'吹气不足',
            textStateEn:'NOT ENOUGH',
            homePointHot:false, //吹气时 隐藏预热过长文案
            process:false,//分析中


            homeTitle: false,
            homeOrangeBtn: false,
        })
    }

    blowing() {
        this._page.setData({
            navBarColor:'#000000',//导航字体颜色
            navBarIconTheme:'black',//导航返回键颜色
            navBarBackground:'#FFFFFF',//导航背景色
            tryAgain:false,
            needCheckOTAUpdate:false,
            noBind:false,
            stateBtnShow: false,
            finding:false,
            state: "设备已连接",
            btnState: false,
            bgColor:"#fff",
            beginFat:false,
            blowpicShow: false,//吹气图片
            readyimg:false,// 预热图片
            blowingImg:true,
            textState:'吹气中',
            textStateEn:'BLOWING',
            disblowImg:false,//吹气不足状态
            homePointHot:false, //吹气时 隐藏预热过长文案
            process:false,//分析中

            homeTitle: false,
            homeOrangeBtn: false,
        })
    }

    blowed() {
        this._page.setData({
            navBarColor:'#000000',//导航字体颜色
            navBarIconTheme:'black',//导航返回键颜色
            navBarBackground:'#FFFFFF',//导航背景色
            tryAgain:false,
            noBind:false,
            needCheckOTAUpdate:false,
            stateBtnShow: false,

            state: "设备已连接",
            finding:false,
            btnState: false,


            bgColor:"#fff",
            beginFat:false,
            blowpicShow: false,//吹气图片
            readyimg:false,// 预热图片
            blowingImg:false,
            textState:'分析中',
            textStateEn:'PROCESSING',
            disblowImg:false,//吹气不足状态
            homePointHot:false, //吹气时 隐藏预热过长文案
            process:true,//分析中
            homeOrangeBtn: false,//重试



            homeTitle: true,
            homeTitleText: "",


        })
    }

}
