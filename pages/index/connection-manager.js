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
        frontColor: '#ffffff',
            backgroundColor: '#EE6F69',
        })
        this._page.setData({
            noBind:true,//显示绑定按钮等
            bgColor:"#EE6F69",//PAGE背景


            headerRight: false,
            stateBtnShow: false,


            btnState: true,
            textStateColor: true,



            blowpicShow: false,



            homeTitle: false,
            homeOrangeBtn: false,
        })
    }

    disconnect() {
        this._page.setData({

           /* tryAgain:true,//未找到设备标志位

            headerRight: true,
            stateBtnShow: true,
            state: "未连接到设备",
            picState: true,
            btnState: false,


            blowpicShow: false,



            homeTitle: false,
            homeOrangeBtn: false,*/
            noBind:false,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",



            btnState: false,


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
    }

    connecting() {
        this._page.setData({
            noBind:false,//显示绑定按钮等
            tryAgain:false,//未找到设备标志位

            headerRight: true,
            stateBtnShow: false,

            state: "正在连接设备",


            beginFat:false,

            btnState: false,
            textState:'',


            blowpicShow: false,



            homeTitle: false,

            homeOrangeBtn: false,
        })
    }

}
