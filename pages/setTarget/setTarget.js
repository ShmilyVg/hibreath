import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
        isTarget:false,//设定目标窗口
        isbe:true,//是否有体脂率的目标
        info:{},
    },

    onLoad: function () {

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
        console.log(this.data.info.weight,"7878")
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
    }
})
