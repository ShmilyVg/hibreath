// pagesIndex/food-details/food-details.js
import Protocol from "../../modules/network/protocol";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodId:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          foodId: options.foodId
      })
    this.getFoodInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  async getFoodInfo(){
    const { result } = await Protocol.postFoodFoodInfo({ foodId: this.data.foodId });
    this.setData({
      title:result.title,
      imgUrl:result.imgUrl,
      calorie:result.calorie,
      carbohydrate:result.carbohydrate,
      fat:result.fat,
      protein:result.protein,
      ingredient:result.ingredient,
      formula:result.formula
    })
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
