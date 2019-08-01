import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
        videoUrl:"http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
        confirmText: '好哒',
        cancelText: '取消',
        tintColor: 'color:#00a48f',
        title:"真棒！",
        content:"恭喜完成本次运动",
        hidden:true,
    },

    onLoad: function () {

    },
    onShow:function () {
        Protocol.postCookInfo({deviceId: this.data.deviceId}).then(data => {

        })
    },

    bindended(){
        this.setData({
            hidden: false
        })
    },

    cancel: function () {

    },

    confirm: function () {
        this.setData({
            hidden: true
        })
    }
})
