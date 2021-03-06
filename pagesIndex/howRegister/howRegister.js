// pagesIndex/howRegister/howRegister.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
Page({
  data: {
    second: 5,
  },
  onLoad: function (options) {
    console.log(options)
    if (options) {
      this.setData({
        taskId: options.taskId,
        isFinshed: options.isfinished == 'true' || options.isfinished == true
      })
    }
  },
  onUnload(){
    getApp().globalData.issueRefresh = true;
  },
  setCecond() {
    let second = this.data.second
    if (second <= 0) {
      return;
    }
    setTimeout(() => {
      --second
      this.setData({
        second: second < 0 ? 0 : second
      })
      this.setCecond();
    }, 1000)
  },
  onShow: function () {
    this.setCecond()
  },
  async submitFun() {
    let data = {
      taskId: this.data.taskId
    }
    await Protocol.postFoodvideo(data);
    getApp().globalData.issueRefresh = true;
    HiNavigator.switchToSetInfo()
  },
})