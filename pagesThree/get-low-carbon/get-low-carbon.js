// pagesThree/get-low-carbon/get-low-carbon.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponCode:0
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
          couponCode:index.couponCode
        })
      }
    })
    HiNavigator.navigateToGetGift({couponCode:this.data.couponCode})
    console.log('couponCode',this.data.couponCode)
  },
  handlerGobackClick(){
    HiNavigator.navigateBack({delta: 1});
  },
  async toYz(){
    if (this.data.content.qualificationStatus == 2){
      let couponCode = this.data.content.couponCode;

      if (couponCode) {

        let res = await Protocol.takeGift({ couponCode });
        if (res.code == 1) {
          wx.showToast({
            title: '领取成功,即将跳转有赞小程序',
            icon: 'none',
            duration: 3000
          });
          setTimeout(() => {
            //跳转有赞小程序
          }, 3000)

        }
      }
    }else{
      wx.showToast({
        title: '即将跳转有赞小程序',
        icon: 'none',
        duration: 3000
      });
      setTimeout(() => {
        //跳转有赞小程序
      }, 3000)
    }
    
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