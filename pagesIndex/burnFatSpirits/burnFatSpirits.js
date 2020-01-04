// pagesIndex/burnFatSpirits/burnFatSpirits.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
Page({
  data: {
    second: 5,
    setCecondFun:false,
    readImgList: [
      'http://img.hipee.cn/hibreath/img/2019116/0c2e0bf0-8bd6-4af3-92ac-c662e6578b19.png',
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
    getApp().globalData.issueRefresh = true;
    if (options) {
      this.setData({
        taskId: options.taskId
      })
    }
  },

  async submitFun(){
    let data ={
      taskId: this.data.taskId
    }
    await Protocol.postFoodvideo(data);
    HiNavigator.switchToSetInfo()
  },
  onReachBottom: function () {
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