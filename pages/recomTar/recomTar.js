// pages/recomTar/recomTar.js
import Protocol from "../../modules/network/protocol";
import {
  Toast as toast,
  Toast,
  WXDialog
} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
Page({
  data: {
    targetDate:{}
  },
  onLoad: function (options) {
    this.getMyLoss();
  },
  onReady: function () {
    
  },
  async getMyLoss(){
    let data = await Protocol.getMyLossfatCourse();
    this.setData({
      targetDate: data.result
    })
  },
  reStart(){
    HiNavigator.navigateToGuidance({ reset:true});
  },
  start(){
    HiNavigator.switchToSetInfo()
  }
})