import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
        isPageIng:true, //进度条
        isPageError:false,//生成失败
        isPageSuccess:false,//生成成功
        value:0,
    },

    onLoad: function () {
        this.startTime();
    },

    startTime(){
        var that =this;
        if(that.data.value ==100){
            that.setData({
                isPageIng:false,
                isPageError:false,
                isPageSuccess:true,
            })
            return;
        }
        setTimeout(function () {
            const val=that.data.value;
            that.setData({value:val<100?val+1:0});
            that.startTime();

        },30);
    },

    pageAgain(){
        this.setData({
            isPageIng:true,
            isPageError:false,
            isPageSuccess:false,
            isTarget:false,
            value:0,
        });
        this.startTime();
    },

    pageTarget(){
            HiNavigator.navigateTarget();
    },

})
