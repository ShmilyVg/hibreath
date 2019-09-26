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

            },1000);
        };
        //蓝牙连接已断开
            this.action[ConnectState.DISCONNECT] = () => {
            this.disconnect();
        };
        //正在连接蓝牙设备
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
            tryAgain:false,//未找到设备标志位
            finding:false,//正在寻找设备标志位


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

            stateBtnShow: true,
            state: "未连接到设备",
            btnState: false,


            homeTitle: false,
            homeOrangeBtn: false,

        });
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

            stateBtnShow: false,

            state: "正在连接设备",


            beginFat:false,

            btnState: false,




            homeTitle: false,

            homeOrangeBtn: false,
        })
    }

}
