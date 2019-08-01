import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
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
