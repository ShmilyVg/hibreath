// pagesIndex/burnFatSpirits/burnFatSpirits.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
Page({
  data: {
    second: 5,
    setCecondFun:false,
    readImgList: [
      'http://img.hipee.cn/hibreath/dangao.png',
      'http://img.hipee.cn/hibreath/img/2019116/9741e6e3-74cc-4824-9341-23bae9c1d9a9.png',
      'http://img.hipee.cn/hibreath/img/2019116/edeba388-e332-4412-ab08-0ac2e84eba97.png',
      'http://img.hipee.cn/hibreath/img/2019116/863c07b1-bdd2-4b07-90e7-888c3d0d2e6e.png',
      'http://img.hipee.cn/hibreath/img/2019116/857e9a22-250c-4f06-b682-038c4949e32b.png',
      'http://img.hipee.cn/hibreath/img/2019116/ad0a5d4a-e6ad-41bc-b130-376ecc42d7ce.png'
    ],
    readImgHead: [
      "零食干扰",
      "刷牙",
      "饮酒饮料",
      "抽烟",
      "涂抹口红",
      "喷香水"
    ],
  },

  onLoad: function (options) {
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
  async submitFun(){
    let data ={
      taskId: this.data.taskId
    }
    await Protocol.postFoodvideo(data);
    getApp().globalData.issueRefresh = true;
    HiNavigator.switchToSetInfo()
  },
  onReachBottom: function () {

  },
  onShow: function () {
    this.setCecond()
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
})
