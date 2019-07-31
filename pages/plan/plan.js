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
        let list=[
            {
                title:"早餐",
                content:[
                    {image:"图片1",contentTitle:"水煮青菜",id:"1"},
                    {image:"图片2",contentTitle:"水煮鸡蛋",id:"2"},
                    {image:"图片3",contentTitle:"水煮墙皮",id:"3"},
                    ],
                kcal:"大约554Kcal"
            },
            {
                title:"午餐",
                content:[
                    {image:"图片1",contentTitle:"水煮青菜",id:"1"},
                    {image:"图片2",contentTitle:"水煮鸡蛋",id:"2"},
                    {image:"图片3",contentTitle:"水煮墙皮",id:"3"},
                ],
                kcal:"大约554Kcal"
            },
            {
                title:"晚餐",
                content:[
                    {image:"图片1",contentTitle:"水煮青菜",id:"1"},
                    {image:"图片2",contentTitle:"水煮鸡蛋",id:"2"},
                    {image:"图片3",contentTitle:"水煮墙皮",id:"3"},
                ],
                kcal:"大约554Kcal"
            },
        ];
        this.setData({
            list:list
        })
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

    cookInfo(e){
        console.log(e,"eee")
    }
})
