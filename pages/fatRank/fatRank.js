import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {

    },

    onLoad: function () {

    },
    onShow:function () {

    },
    toIndex(){
        HiNavigator.navigateIndex();
        getApp().needCheckOTAUpdate = true;
    }

})
