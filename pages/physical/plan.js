import HiNavigator from "../../navigator/hi-navigator";

Page({

    data: {

    },
    onLoad: function () {
        //section 区间标志位备用
        let list=[
                {
                    title:"BMI",
                    number:"28.3",
                    array:[
                        {BMInumber:"<18.5",BMI:"低",section:false},
                        {BMInumber:"18.5-24",BMI:"健康",section:false},
                        {BMInumber:">24",BMI:"高",section:true},
                        ]
                },
                {
                    title:"体重",
                    number:"80kg",
                    array:[
                        {BMInumber:"<70",BMI:"低",section:false},
                        {BMInumber:"70-75",BMI:"健康",section:false},
                        {BMInumber:">75",BMI:"高",section:true},
                    ]
                },
                {
                    title:"体脂率",
                    number:"25%",
                    array:[
                        {BMInumber:"<15",BMI:"低",section:false},
                        {BMInumber:"15-18",BMI:"健康",section:false},
                        {BMInumber:">18",BMI:"高",section:true},
                    ]
                },
            ]
        let suggestList=[
            {text_zh:"根据您的身体状态和营养需求，提供个性化的智能减脂餐指导建议，建议每日摄入1535左右千卡的热量"},
            {text_zh:"增加运动量与适当控制膳食总能量和减少饱和脂肪酸摄入量相结合，促进能量负平衡，是世界公认的减重良方"},
            {text_zh:"提倡采用有氧运动，如走路、骑车、爬山、打球等，尽量减少静坐时间，但没有必要进行剧烈运动以减肥"}
        ]
        this.setData({
            list: list,
        })
        this.setData({
            suggestList: suggestList,
        })
    },

    toSetInfo(){
        HiNavigator.navigateToSetInfo();
    }
})
