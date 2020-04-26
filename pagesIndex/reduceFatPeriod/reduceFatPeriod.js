// pagesIndex/reduceFatPeriod/reduceFatPeriod.js
import { getLatestOneWeekTimestamp } from "../../utils/time";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import { Toast as toast, Toast, WXDialog } from "heheda-common-view";
const app = getApp();
Page({
  data: {
    currenttab: 'howEatBox',
    typeList: [{ type: 'howEatBox', title: '盒子日怎么吃' }, { type: 'lowFat', title: '低碳日怎么吃' }],
    table: ['一', '二', '三', '四', '五', '六', '日'],
  },
  

  onLoad(options) {
    console.log(app.globalData.shoppingJumpCodes)
  },

  onShow: function () {
    this.getBoxHowToEat();
    this.getAdditionalMeal();
    this.getLowCarbonDayHowToEat();
  },
  async getBoxHowToEat() {
    try {
      const { result } = await Protocol.getBoxHowToEat()
      this.setData({
        boxHowToEat: result
      })
    } catch (error) { }

  },
  async getAdditionalMeal() {
    let { result } = await Protocol.getAdditionalMeal()
    this.setData({
      additionalMea:result
    })
  },
  async getLowCarbonDayHowToEat(){
    let { result } = await Protocol.getLowCarbonDayHowToEat()
    console.log('dayHowToEat', result)
    this.setData({
      dayHowToEat: result
    })
  },
  goToBurn(){
    HiNavigator.navigateToRecomTarNew()
  },
  //切换标签页
  async selectTab(e) {
    let newtab = e.currentTarget.dataset.tabid;
    console.log(newtab)
    if (this.data.currenttab !== newtab) {
      this.setData({
        currenttab: newtab
      });
    }
  },
  toRecomTarNew() {
    HiNavigator.navigateToRecomTarNew()
  },
  toSetInfo() {
    HiNavigator.switchToSetInfo()
  },
  fatTaskToFinish() {
    wx.getSystemInfo({
      success(res) {
        if (res.locationEnabled && res.bluetoothEnabled && res.locationAuthorized) {
          HiNavigator.navigateIndex();
          return
        } else if (!res.bluetoothEnabled) {
          setTimeout(() => {
            WXDialog.showDialog({ title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了' });
          }, 200);
          return
        } else if (!res.locationEnabled) {
          setTimeout(() => {
            WXDialog.showDialog({ title: '小贴士', content: '请开启手机GPS/位置', confirmText: '我知道了' });
          }, 200);
          return
        } else if (!res.locationAuthorized) {
          setTimeout(() => {
            wx.showModal({
              title: '小贴士',
              content: '前往手机【设置】->找到【微信】应用\n' +
                '\n' +
                '打开【微信定位/位置权限】',
              showCancel: false,
              confirmText: '我知道了',
            })
          }, 200);
          return
        }
        HiNavigator.navigateToResultNOnum();
      }
    })
  },
  goToReplenish() {
    HiNavigator.navigateToBoxReplenish();
  },
  goNextPage(e){
    let index = e.currentTarget.dataset['index'];
    switch(index){
      case 0:
        HiNavigator.navigateTorecommendation();
        break;
      case 1:
        HiNavigator.navigateToTakeOutSelect();
        break;
      case 2:
        HiNavigator.navigateToIndulge()
        break;
    }
  },
  goToGift(){
    let couponCodeItem;
    let list = app.globalData.shoppingJumpCodes;
    for (let item of list){
      if (item.code == 'box'){
        couponCodeItem = item
        break;
      }
    }
    if (couponCodeItem.status >0){
      HiNavigator.navigateToGetGift({ couponCode: couponCodeItem.couponCode });
    }else{
      wx.showToast({
        title: '该功能正在维护',
        icon: 'none',
        duration: 2000
      })
    }
    
  }
})