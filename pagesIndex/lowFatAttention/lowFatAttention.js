// pagesIndex/lowFatAttention/lowFatAttention.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 5,
    unfoldTip:false,
    readImgList:[
      '../images/icon/water.png',
      '../images/icon/na.png',
      '../images/icon/dapei.png',
      '../images/icon/sport.png',
      '../images/icon/fat.png',
      '../images/icon/jianchi.png',
    ],
    readImgHead:[
      '每天饮水2000ml',
      '食物中补充适当的钾、镁',
      '荤素搭配',
      '不要过度运动',
      '适当的补充脂肪摄入量',
      '坚持就是胜利'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        taskId: options.taskId,
        isFinshed: options.isfinished == 'true'
      })
    }
  },
  onUnload(){
    getApp().globalData.issueRefresh = true;
  },
  onShow: function () {
    this.setCecond()
  },
  unfold(){
    this.setData({
      unfoldTip: !this.data.unfoldTip
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
  async submitFun(){
    let data ={
      taskId: this.data.taskId
    }
    await Protocol.postFoodvideo(data);
    HiNavigator.switchToSetInfo()
  }
})