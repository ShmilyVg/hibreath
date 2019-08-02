import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
        isPageIng:false, //进度条
        isPageError:false,//生成失败
        isPageSuccess:true,//生成成功
        value:0,
    },

    onLoad: function () {
        this.startTime();
        let list=[
            {
                title:"采购清单",
                content:[
                    {image:"../../images/set-info/man-select.png",contentTitle:"Day1-3需要采购的食材",id:"1"},
                ],
                kcal:""
            },
            {
                title:"早起",
                content:[
                    {image:"../../images/set-info/man-select.png",contentTitle:"记体重&体脂",id:"1"},
                ],
                kcal:""
            },
            {
                title:"早餐",
                content:[
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮青菜",id:"1"},
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮鸡蛋",id:"2"},
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮墙皮",id:"3"},
                    ],
                kcal:"大约554Kcal"
            },
            {
                title:"午餐",
                content:[
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮青菜",id:"1"},
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮鸡蛋",id:"2"},
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮墙皮",id:"3"},
                ],
                kcal:"大约554Kcal"
            },
            {
                title:"晚餐",
                content:[
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮青菜",id:"1"},
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮鸡蛋",id:"2"},
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮墙皮",id:"3"},
                ],
                kcal:"大约554Kcal"
            },
            {
                title:"运动",
                content:[
                    {image:"../../images/set-info/man-select.png",contentTitle:"HIIT唤醒",id:"1",time:"约7分钟"},
                ],
                kcal:"预计消耗大约554Kcal"
            },
        ];
        this.setData({
            list:list
        });

        let swiperList=[
                {pic:"../../images/set-info/woman-select.png"},
                {pic:"../../images/set-info/woman-select.png"},
                {pic:"../../images/set-info/woman-select.png"},
                {pic:"../../images/set-info/woman-select.png"},
                {pic:"../../images/set-info/woman-select.png"},
            ];
        this.setData({
            swiperList:swiperList
        });
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
