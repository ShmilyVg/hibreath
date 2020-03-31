// pagesThree/get-low-carbon/get-low-carbon.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.getLowCarbonSnacks()
  },
  async getLowCarbonSnacks(){
    let { result } = await Protocol.getLowCarbonSnacks();
    this.setData({
      content:result
    })
  },
  async getShoppingJumpCodes(){
    let { result } = await Protocol.getShoppingJumpCodes();
    result.map((index,value)=>{
      if(index.code == 'box'){
        this.setData({
          couponId:index.couponId
        })
      }
    })
    HiNavigator.navigateToGetGift({couponId:this.data.couponId})
    console.log('couponId',this.data.couponId)
  },
  handlerGobackClick(){
    HiNavigator.navigateBack({delta: 1});
  }

  ,
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