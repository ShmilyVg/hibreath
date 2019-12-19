// pagesIndex/food-recommendation/food-recommendation.js
import Protocol from "../../modules/network/protocol";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      idx:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
       const {result:dateResult} = await Protocol.postFoodDateInfo()
       this.setData({
           dateResult:dateResult
       })
      this.data.dateResult.date.map((value, index) => {
          value.map((value, index) =>{
              if(value.click){
                  this.setData({
                      idx:value.item
                  })
              }
          })
      });
      const {result} = await Protocol.postFoodItemInfo()
      console.log('122'.result)
  },
    async secDate(e){
        let id = e.currentTarget.dataset.id
        console.log(e,'id')
        this.setData({
            idx: id
        })
        const {result} = await Protocol.postFoodItemInfo({itemId:e.currentTarget.dataset.id})
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
