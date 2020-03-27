// pagesIndex/Indulge/Indulge.js
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodList:[
      {
        "img": "http://img.hipee.cn/hibreath/food/%e7%94%9c%e8%84%86%e5%9d%9a%e6%9e%9c%e6%a3%92.png",
        "calorie": "约420cal",
        "carbohydrate": "约16.5g",
        "quantityDesc":"3块/次",
        "title":"拌小白菜",
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    const{result}= await Protocol.Indulge();
    this.setData({
      dataList:result
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})