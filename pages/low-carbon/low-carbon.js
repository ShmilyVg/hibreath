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
    
  },
  async getResult() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    try{
      let { result } = await Protocol.getLossfatCourse({});
      this.setData({
        result
      })
    }catch(err){}
    wx.hideLoading();
    
  },
  onShow: function () {
    this.getResult()
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
    //参数  为1的时候从减脂方案页进入
    let fromPage = 1;
    HiNavigator.navigateToWeightTarget(fromPage);
  },
  //低碳巩固期
  goToConsolidate(){
    HiNavigator.navigateToConsolidate();
  },
  //低碳减脂期
  goToReduce() {
    HiNavigator.navigateToReduceFatPeriod();
  },
  async toSetInfo(e){
    const {
      detail: {
        userInfo,
        encryptedData,
        iv
      }
    } = e;
    if (!!userInfo) {
      await Login.doRegister({
        userInfo,
        encryptedData,
        iv
      });
      let finishedPhone = wx.getStorageSync('finishedPhone')
      if (finishedPhone) {
        HiNavigator.navigateToGuidance({ reset: 2 });
      } else {
        HiNavigator.navigateToGuidance({});
      }

    }
  }
})