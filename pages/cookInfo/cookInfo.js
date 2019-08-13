import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {

    },

    onLoad: function () {

    },
    onShow:function () {
        Protocol.postCookInfo({deviceId: this.data.deviceId}).then(data => {

        })
        let cookInfoList={
            image:"https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=0e4071f88f35e5dd8421ad8d17afcc8a/ac4bd11373f082021b2d009541fbfbedaa641bd8.jpg",
            title:"油煮青菜",
            ingredients:"小白菜100g、香油3g、咸鸭蛋半个",
            cook:[
                {step:"小白菜洗净切小段"},
                {step:"锅中放半杯水，加小半匙香油"},
                {step:"煮沸后加入小白菜和切碎的咸鸭蛋蛋白，煮2分钟"},
                {step:"加入蛋黄，即可完成"},
            ]
        }
        this.setData({
            cookInfoList: cookInfoList
        })
    },

})
