// pagesIndex/attendanceBonus/attendanceBonus.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import { Toast as toast, Toast, WXDialog } from "heheda-common-view";
const app = getApp();
Page({

  data: {
    breathSign: {},//签到数据
  },
  onLoad: function (options) {
    this.getBreathSignInInfo();
    
  },

  onShow: function () {

  },
  async getGiftInfo(result){
   
    let couponCode = result.couponCode;
    if (couponCode){
      const { result } = await Protocol.getGift({ couponCode: couponCode })
      this.setData({
        gift: result
      })
    }
  },
  async takeGift(){
    let couponCode = this.data.couponCode;
    if (couponCode){
      let res = await Protocol.takeGift({ couponCode });
      if (res.code == 1){
        wx.showToast({
          title: '领取成功,已放入“我的-优惠券”中',
          icon: "none",
          duration: 3000
        });
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1,
          })
        },3000)
        
      }
    }
  },
  handlerGobackClick(){
    wx.navigateBack({
      delta: 1
    });
  },
  async getBreathSignInInfo() {
    const { result } = await Protocol.getBreathSignInInfo();
    let data = result.data;
    for (let item of data) {
      if (item.executeOrder < result.days && !item.isFinished) {
        result.replenish = true;
        break;
      }
    }
    this.getGiftInfo(result);
    this.setData({
      breathSign: result
    })
  },
  onShareAppMessage(){
    return{
      title: '我在Slimple低碳club减脂！拜托 拜托！来帮我补个卡吧~',
      path: `/pagesThree/help-cards/help-cards?sharedId=${this.data.breathSign.sharedId}`,
      imageUrl: this.data.breathSign.sharedImg
    }
  }
})