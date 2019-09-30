import WXDialog from "../../view/dialog";
import {ConnectState} from "../../modules/bluetooth/bluetooth-state";
import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";
export default class ConnectionManager {

    constructor(page) {
        this._page = page;
        this._timeoutIndex = 0;
        this.action = {};
        console.log('ConnectState',ConnectState)
        this.action[ConnectState.UNBIND] = () => {
            this.unbind();

        };

        this.action[ConnectState.UNAVAILABLE] = () => {
            this.disconnect();
            console.log("this._timeoutIndex",this._timeoutIndex)
            if(this._timeoutIndex !=0){
                clearTimeout(this._timeoutIndex);
                return;
            }
            this._timeoutIndex = setTimeout(() => {
                WXDialog.showDialog({title: 'TIPS', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
            },200);
        };
        //蓝牙连接已断开
            this.action[ConnectState.DISCONNECT] = () => {
            this.disconnect();
        };
        //正在连接蓝牙设备
        this.action[ConnectState.CONNECTING] = ()=>{
            this.connecting();
        };
        //蓝牙已连接
       /* this.action[ProtocolState.QUERY_DATA_START]=
        this.action[ConnectState.CONNECTED] = ()=>{
            this.connected();
        };*/
    }


/*    cycle(){
        const that =this
        if(this.timer<200000){
            setTimeout(function () {
                if(that.counter == that.fatBuringImgarr.length){
                    that.counter = 0;
                }
                that._page.setData({
                    fatBuringImg:that.fatBuringImgarr[that.counter]
                })
                that.counter++;
                that.timer++
                that.cycle()
            }, 1000)

        }


    }*/
    unbind() {
        wx.setNavigationBarColor({
        frontColor: '#ffffff',
            backgroundColor: '#EE6F69',
        })
        this._page.setData({
            noBind:true,//显示绑定按钮等
            bgColor:"#EE6F69",//PAGE背景
            tryAgain:false,//未找到设备标志位
            finding:false,//正在寻找设备标志位


            stateBtnShow: false,


            btnState: true,

            homePointHot:false,
            blowpicShow: false,



            homeTitle: false,
            homeOrangeBtn: false,
        })
    }

    disconnect() {
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#EE6F69',
        })
        this._page.setData({
            tryAgain:true,//未找到设备标志位
            finding:false,//正在寻找设备标志位
            bgColor:"#EE6F69",


            readyimg:false,
            blowpicShow:false,
            textState:"",
            textStateEn:"",
            disblowImg:false,
            blowingImg:false,
            process:false,
            homePointHot:false,
            stateBtnShow: true,
            state: "未连接到设备",
            btnState: false,


            homeTitle: false,
            homeOrangeBtn: false,
        });
    /*        noBind:false,
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

        });
        this._page.setData({
            blowNumber: 5
        });
        var that = this;
        let countDownNum =4
        var int=setInterval(function () {
            that._page.setData({
                blowNumber: countDownNum
            })
            if ( countDownNum == 0) {
                clearInterval(int);
            }

            countDownNum--;

        }, 1000)*/
    }

    connecting() {
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
        })
        this._page.setData({
            noBind:false,//显示绑定按钮等
            tryAgain:false,//未找到设备标志位
            finding:true,//正在寻找设备标志位
            bgColor:"#fff",
            contentStateB:"正在寻找您的设备",
            contentStateS:"长按设备按键·3秒开机",


            readyimg:false,
            blowpicShow:false,
            textState:"",
            textStateEn:"",
            disblowImg:false,
            blowingImg:false,
            process:false,
            homePointHot:false,
            stateBtnShow: false,

            state: "正在连接设备",


            beginFat:false,

            btnState: false,




            homeTitle: false,

            homeOrangeBtn: false,
        })
    }
    connected() {
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
        })
        this._page.setData({
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
            beginFat:true,//连接成功
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
    }
}
