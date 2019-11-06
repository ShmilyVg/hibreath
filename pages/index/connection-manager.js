import {ConnectState} from "../../modules/bluetooth/bluetooth-state";
import {ProtocolState} from "../../modules/bluetooth/bluetooth-state";
import {WXDialog} from "heheda-common-view";
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
        this._page.setData({
            navBarColor:'#FFFFFF',//导航字体颜色
            navBarIconTheme:'white',//导航返回键颜色
            navBarBackground:'#EE6F69',//导航背景色

            needCheckOTAUpdate:false,
            noBind:true,//显示绑定按钮等
            bgColor:"#EE6F69",//PAGE背景
            tryAgain:false,//未找到设备标志位
            finding:false,//正在寻找设备标志位
            readyimg:false,
            stateBtnShow: false,
            btnState: true,
            homePointHot:false,
            blowpicShow: false,
            homeTitle: false,
            homeOrangeBtn: false,
        })
    }

    disconnect() {
        this._page.setData({
            navBarColor:'#FFFFFF',//导航字体颜色
            navBarIconTheme:'white',//导航返回键颜色
            navBarBackground:'#EE6F69',//导航背景色

            tryAgain:true,//未找到设备标志位
            finding:false,//正在寻找设备标志位
            bgColor:"#EE6F69",
            needCheckOTAUpdate:false,

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
    }

    connecting() {
        this._page.setData({
            navBarColor:'#000000',//导航字体颜色
            navBarIconTheme:'black',//导航返回键颜色
            navBarBackground:'#FFFFFF',//导航背景色

            needCheckOTAUpdate:false,
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
        this._page.setData({
            navBarColor:'#000000',//导航字体颜色
            navBarIconTheme:'black',//导航返回键颜色
            navBarBackground:'#FFFFFF',//导航背景色

            needCheckOTAUpdate:false,
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
