import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
        value:0,
        isToday:false,//今天是否设置过体重体脂
    },

    onLoad: function () {
        let list=[
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
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮青菜",id:"6"},
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮鸡蛋",id:"7"},
                    {image:"../../images/set-info/man-select.png",contentTitle:"水煮墙皮",id:"9"},
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

        ];
        let shoppingList=[
            {
                title:"采购清单",
                content:[
                    {image:"../../images/set-info/man-select.png",contentTitle:"Day1-3需要采购的食材",id:"11"},
                ],
                kcal:""
            },
        ];
        let sportList=[{
                title:"运动",
                id:"1",
                content:[
                    {image:"../../images/set-info/man-select.png",contentTitle:"HIIT唤醒",time:"约7分钟",},
                ],
                kcal:"预计消耗大约554Kcal"
            },]
        this.setData({
            shoppingList:shoppingList,
            sportList:sportList,
            list:list
        });
    },

    onShow:function(){

    },

    pageTarget(){
        HiNavigator.navigateTarget();
    },
    //获取今日 体重体脂记录
    getTodayInfo(){
        Protocol.postTodayBMI().then(data => {

        })
    },

    toShoppingList:function(e){
        var id = e.currentTarget.dataset.id;
        console.log("id",id)
        HiNavigator.navigateToHIIT({id});
    },

    toHIIT:function(e){
        var id = e.currentTarget.dataset.id;
        console.log("id",id)
        HiNavigator.navigateToHIIT({id});
    },

    toCookInfo:function(e){
        var id = e.currentTarget.dataset.id;
        console.log("id",id)
        HiNavigator.navigateTocookInfo({id});
    },
    cookInfo(e){
        console.log(e,"eee")
    }
})
