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
    getApp().globalData.issueRefresh = true;
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
  async start(){
    await Protocol.postMembersJoinSchema({});
    HiNavigator.switchToSetInfo()
  }
})