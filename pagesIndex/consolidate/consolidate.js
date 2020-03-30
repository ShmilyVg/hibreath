// pagesIndex/consolidate/consolidate.js
import { getLatestOneWeekTimestamp } from "../../utils/time";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import { Toast as toast, Toast, WXDialog } from "heheda-common-view";

Page({
  data: {
  },

  onLoad(options) {
  },
  onShow: function () {
    this.getLowCarbonDayHowToEat();
  },
  async getLowCarbonDayHowToEat() {
    let { result } = await Protocol.getLowCarbonDayHowToEat()
    console.log('dayHowToEat', result)
    this.setData({
      dayHowToEat: result
    })
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
  goNextPage(e) {
    let index = e.currentTarget.dataset['index'];
    switch (index) {
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
  goToGift() {
    let couponId;
    let list = app.globalData.shoppingJumpCodes;
    for (let item of list) {
      if (item.code == 'milkshake') {
        couponId = item.couponId
        break;
      }
    }
    HiNavigator.navigateToGetGift({ couponId });
  }
})