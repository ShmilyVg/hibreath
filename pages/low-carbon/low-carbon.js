// pages/low-carbon/low-carbon.js
import {getLatestOneWeekTimestamp} from "../../utils/time";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";

Page({
  data: {
    result: {},
  },
  
  onLoad(options) {
    wx.showTabBar({
      fail: function () {
        setTimeout(function () {
          wx.showTabBar();
        }, 500);
      }
    });
    this.getResult()
  },
  async getResult() {
    let { result } = await Protocol.getLossfatCourse({});
    this.setData({
      result
    })
  },
  onShow: function () {
    if (!this.data.result){
      this.getResult()
    }
  },
  //加群页
  goToAddLowfat() {
    HiNavigator.navigateToAddLowfatGroup();
  },
  //低碳适应期
  goToAdaptive(){
    HiNavigator.navigateToAdaptive();
  },
  toRecomTarNew(){
    HiNavigator.navigateToWeightTarget();
  },
  //低碳巩固期
  goToConsolidate(){
    HiNavigator.navigateToConsolidate();
  },
  //低碳减脂期
  goToReduce() {
    HiNavigator.navigateToReduceFatPeriod();
  },
  toSetInfo(){
    HiNavigator.switchToSetInfo()
  }
})