import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
        bindSuccessArr:[
            "若有饮酒请间隔24小时以上再进行检测",
            "吸烟、涂抹口红、喷香水等行为会对检测结果的准确性产生影响",
            "测试完毕后使用洁净柔软的干布或纸张轻轻擦拭干净吹气口。使用后请盖好保护盖，防止灰尘等细小异物"
        ],
        currentSwiper: 0,
    },

    onLoad: function () {

    },
    onShow:function () {

    },
    swiperChange: function (e) {
        this.setData({
            currentSwiper: e.detail.current
        })
    },
    toIndex(){
       /* HiNavigator.navigateIndexBind({isBind:true})*/
        HiNavigator.navigateIndex()
    }

})
