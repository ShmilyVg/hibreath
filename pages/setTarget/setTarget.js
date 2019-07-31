import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";
import WXDialog from "../../view/dialog";

Page({

    data: {
        isTarget:false,//设定目标窗口
        isbe:true,//是否有体脂率的目标
        info:{},
    },

    onLoad: function () {
        WXDialog.showDialog({title: '小贴士', content: '若您目前及近期没有体脂称，来进行每日的体脂率的监测，本次燃脂计划可以暂时取消体脂率目标', confirmText: '我知道啦'});
    },

    startTime(){

    },


    bindWeightInput(e) {
        this.setData({
            'info.weight': e.detail.value
        })
    },
    //填写体脂率
    bindBMIInput(e){
        console.log(e.detail)
        this.setData({
            'info.bodyFatRate': e.detail.value+"%"
        })
    },
    //设置减脂方案目标
    continue(){
        if(typeof (this.data.info.weight) == "undefined"){
            toast.warn('请填写体重');
        }else if(typeof (this.data.info.bodyFatRate) == "undefined" && this.data.isbe == true){
            toast.warn('请填写体脂率');
        }else{
            Protocol.postSetTarget(this.data.info).then(data => {
                this.setData({
                    isTarget:false
                });
            })
        }
    },

    cancelTarget(){
        this.setData({
            isbe: false
        })
    },

    //获取减脂方案目标数值
    getTargetNmuber(){
        Protocol.postSetTarget(this.data.info).then(data => {

        })
    }
})
