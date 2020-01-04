// pagesIndex/lowFatAttention/lowFatAttention.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 5,
    unfoldTip:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  unfold(){
    this.setData({
      unfoldTip:true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.setCecond();
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})