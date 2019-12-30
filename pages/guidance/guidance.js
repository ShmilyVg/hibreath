// pages/guidance/guidance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    tieleName:'立即登录'
  },
  goNextPage(){
    this.setData({
      page: ++this.data.page
    });
    this.setNavigatStyle()
  },
  //设置navigationBarTitle
  setNavigatStyle(){
    let page = this.data.page;
    let name = '立即登录'
    let frontColor = '#ffffff';
    let backgroundColor ='#ED6F69'
    if (page != 1){
      name = 'HiPee健康燃脂';
      wx.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#ffffff' });
    }
    wx.setNavigationBarTitle({
      title: name
    })

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})