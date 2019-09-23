import WXDialog from "../../view/dialog";
import {ConnectState} from "../../modules/bluetooth/bluetooth-state";

export default class ConnectionManager {
    constructor(page) {
        this._page = page;
        this._timeoutIndex = 0;
        this.action = {};
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
        this._page.setData({

            burnupShow: true,
            userInfoShow: true,
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

            burnupShow: false,
            userInfoShow: true,
            headerRight: true,
            stateBtnShow: false,

            state: "设备已连接",
            stateColorIndex: 1,

            picState: false,
            btnState: false,
            hintPic: true,



            blowpicShow: false,//吹气图片
            readyimg:false,// 预热图片
            blowingImg:false,
            disblowImg:true,//吹气不足状态
            textState:'吹气不足',
            textStateEn:'NO ENOUGH',



            homeHeartBoxIndex: 1,

            connectpicShow: false,
            homePointFirst: false,
            homePointSecond: true,

            homeBtn: false,

            homeTitle: false,
            homePShow: false,
            homeOrangeBtn: false,
        });
    }

    connecting() {
        this._page.setData({

            burnupShow: false,
            userInfoShow: true,
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
