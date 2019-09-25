import WXDialog from "../../view/dialog";
import {ConnectState} from "../../modules/bluetooth/bluetooth-state";

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
            clearTimeout(this._timeoutIndex);
            this._timeoutIndex = setTimeout(() => {
                WXDialog.showDialog({title: 'TIPS', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
                this.disconnect();

            },200);
        };
            this.action[ConnectState.DISCONNECT] = () => {
            this.disconnect();



        };

        this.action[ConnectState.CONNECTING] = ()=>{
            this.connecting();
        };

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
        frontColor: '#ffffff', // 必写项
            backgroundColor: '#EE6F69', // 必写项
           /* animation: { // 可选项
            duration: 400,
                timingFunc: 'easeIn'
        }*/
        })
        this._page.setData({
            noBind:true,//显示绑定按钮等
            bgColor:"#EE6F69",//PAGE背景




            headerRight: false,
            stateBtnShow: false,

            picState: false,
            btnState: true,
            hintPic: true,
            textStateColor: true,
            homeHeartBoxIndex: 0,

            connectpicShow: false,
            blowpicShow: false,

            homePointFirst: true,
            homePointSecond: false,

            homeBtn: true,

            homeTitle: false,
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

    disconnect() {
        this._page.setData({

            headerRight: true,
            stateBtnShow: true,

            state: "未连接到设备",
            stateColorIndex: 0,

            picState: true,
            btnState: false,
            hintPic: true,
            picStateUrl:'../../images/index/warn.png',
            homeHeartBoxIndex: 0,

            connectpicShow: false,
            blowpicShow: false,

            homePointFirst: true,
            homePointSecond: false,

            homeBtn: true,

            homeTitle: false,
            homePShow: false,
            homeOrangeBtn: false,
      /*      burnupShow: false,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",
            stateColorIndex: 1,

            picState: true,
            btnState: false,
            hintPic: true,
            picStateUrl:'../../images/index/note.png',


            blowpicShow: false,//吹气图片
            readyimg:false,// 预热图片
            blowingImg:false,
            textState:'正在生成结果',
            textStateEn:'IN PROCESS',
            disblowImg:false,//吹气不足状态
            homePointHot:false, //吹气时 隐藏预热过长文案
            process:true,//分析中


            homeHeartBoxIndex: 1,
            connectpicShow: false,

            homePointFirst: false,
            homePointSecond: false,

            homeBtn: false,

            homeTitle: true,
            homeTitleText: "吹气完成，正在生成结果",
            homePShow: false,
            homeOrangeBtn: false,*/
        });
    }

    connecting() {
        this._page.setData({


            headerRight: true,
            stateBtnShow: false,

            state: "正在连接设备",
            stateColorIndex: 0,

            picState: false,
            btnState: false,
            hintPic: true,
            textState:'',
            homeHeartBoxIndex: 2,

            connectpicShow: false,
            blowpicShow: false,

            homePointFirst: true,
            homePointSecond: false,

            homeBtn: true,

            homeTitle: false,
            homePShow: false,
            homeOrangeBtn: false,
        })
    }

}
