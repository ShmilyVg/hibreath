// pagesIndex/burnFatSpirits/burnFatSpirits.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 5,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  submitFun() {


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setDate
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setCecond()

  },
  setCecond() {
    if (this.data.second <= 0) {
      return;
    }
    setTimeout(() => {
      this.setData({
        second: --this.data.second
      })
      this.setCecond();
    }, 1000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})