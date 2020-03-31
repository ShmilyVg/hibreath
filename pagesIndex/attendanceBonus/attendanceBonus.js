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
   
    let couponId = result.couponId;
    console.log(couponId);
    if (couponId){
      const { result } = await Protocol.getGift({ couponId: couponId })
      this.setData({
        gift: result
      })
    }
  },
  async takeGift(){
    let couponId = this.data.couponId;
    let executeOrder = this.data.breathSign.days;
    if (couponId){
      let res = await Protocol.takeGift({ couponId, executeOrder });
      if (res.code == 1){
        wx.showToast({
          title: '领取成功',
          icon: none,
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
      title: '我正在低碳燃脂，快来一起加入！',
      path: `/pages/sharedGuidance/sharedGuidance?sharedId=${this.data.breathSign.sharedId}`,
      imageUrl: this.data.shareImg
    }
  }
})