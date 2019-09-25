/**
 * @Date: 2019-09-25 19:38:38
 * @LastEditors: 张浩玉
 */
import HiNavigator from "../../navigator/hi-navigator";
import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";


export default class BlowManager {
    constructor(page) {
        this._page = page;
        this.actionBlow = {};
        this.actionBlow[ProtocolState.PRE_HOT_START] = () => {
            this.ready();
            this.timer()

        };

        this.actionBlow[ProtocolState.PRE_HOT_FINISH_AND_START_BREATH] = () => {
            this.blow();
            page.picAnimation();
        };

        this.actionBlow[ProtocolState.BREATH_RESTART] = () => {
            this.disblow();
        };

        this.actionBlow[ProtocolState.BREATH_START] = () => {
            this.blowing();
            this._page.setData({
                blowNumber: 5
            });
            this.timerblow()
        };

        this.actionBlow[ProtocolState.BREATH_FINISH] = () => {
            this.blowed();
        };

        this.actionBlow[ProtocolState.CONNECTED_AND_BIND] =
            this.actionBlow[ProtocolState.TIMESTAMP] =
                this.actionBlow[ProtocolState.DORMANT] = () => {
                    this.connected();
                    page.picAnimation();
                };
    }
    //若预热中状态持续＞2分钟，仍然没有进入下一环节，则出现该提示文案
    timer(){
         var that = this;
         let countDownNum =120
         setInterval(function () {
             countDownNum--;
             if ( countDownNum == 0) {
                 clearInterval();
                 that._page.setData({
                     homePointHot: true
                 })
             }
         }, 1000)
     }


    timerblow(){
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
    connected() {
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
        })
        this._page.setData({
            noBind:false,
            blowpicShow: false,
            readyimg:false,// 预热图片显示
            blowingImg:false,
            textState:'',
            textStateEn:'',
            disblowImg:false,//吹气不足状态
            process:false,//分析中
            beginFat:true,//连接成功
            topState:"开启您的燃脂之旅",
            topStateS:"短按设备按键·开始检测",
            bgColor:"#fff",
            homePointHot:false,


            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",

            btnState: false,


            homeTitle: false,
            homeOrangeBtn: false,
        })
    }

    ready() {
        this._page.setData({
            noBind:false,
            headerRight: true,
            stateBtnShow: false,
            state: "设备已连接",

            btnState: false,


            bgColor:"#fff",
            beginFat:false,
            blowpicShow: false,
            readyimg:true,// 预热图片显示
            blowingImg:false,
            textState:'预热中',
            textStateEn:'PREHEATING',
            disblowImg:false,//吹气不足状态
            process:false,//分析中


            homeTitle: false,
            homeOrangeBtn: false,
        })
    }

    blow() {
        this._page.setData({
            noBind:false,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",



            btnState: false,

            bgColor:"#fff",
            beginFat:false,
            blowpicShow: true,//吹气图片显示
            readyimg:false,// 预热图片显示
            blowingImg:false,
            textState:'已就绪·请吹气',
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

            noBind:false,
            headerRight: true,
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
            textStateEn:'NO ENOUGH',
            homePointHot:false, //吹气时 隐藏预热过长文案
            process:false,//分析中


            homeTitle: false,
            homeOrangeBtn: false,
        })
    }

    blowing() {
        this._page.setData({
            noBind:false,
            headerRight: true,
            stateBtnShow: false,

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
            noBind:false,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",

            btnState: false,


            bgColor:"#fff",
            beginFat:false,
            blowpicShow: false,//吹气图片
            readyimg:false,// 预热图片
            blowingImg:false,
            textState:'正在生成结果',
            textStateEn:'IN PROCESS',
            disblowImg:false,//吹气不足状态
            homePointHot:false, //吹气时 隐藏预热过长文案
            process:true,//分析中
            homeOrangeBtn: false,//重试



            homeTitle: true,
            homeTitleText: "",


        })
    }

}
