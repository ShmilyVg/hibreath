import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
        value:0,
        isToday:false,//今天是否设置过体重体脂
    },

    onLoad: function () {
        let array=[
            {
                title:"推荐蔬菜",
                list:[
                        {name: '1', value: '黄瓜', checked: true},
                        {name: '2', value: '芹菜', checked: true},
                        {name: '3', value: '白菜', checked: true},
                    ],
                tips:"蔬菜可以根据个人喜好进行调整，原则上以绿色、深绿色叶菜为主即可。"
            },
            {
                title:"推荐肉类",
                list:[
                    {name: '1', value: '牛肉', checked: true},
                    {name: '2', value: '猪肉', checked: false},
                    {name: '3', value: '鸡肉', checked: false},
                ]
            },
            {
                title:"推荐水果",
                list:[
                    {name: '1', value: '苹果', checked: true},
                    {name: '2', value: '柚子', checked: false},
                    {name: '3', value: '火龙果', checked: true},
                ],
                tips:"水果可以根据个人喜好进行调整，原则上以绿色、深绿色叶菜为主即可。"
            },
            {
                title:"其他",
                list:[
                    {name: '1', value: '小米', checked: true},
                    {name: '2', value: '牛奶', checked: false},
                ]
            },

        ]
        this.setData({
            array:array,
            title:"Day1 ~ Day7"
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

})
