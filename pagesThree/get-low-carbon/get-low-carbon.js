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
    HiNavigator.switchToSetInfo()
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
            wx.navigateToMiniProgram({
              appId:'wxeea809f23b5a5d9d',
              extraData: {
                // foo: 'bar'
              },
              envVersion: 'develop',
              success: (res) => {
                // 打开成功
                console.log('打开有赞小程序成功', res);
              }
            })
          }, 1000)

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
        wx.navigateToMiniProgram({
          appId:'wxeea809f23b5a5d9d',
          extraData: {
            // foo: 'bar'
          },
          envVersion: 'develop',
          success: (res) => {
            // 打开成功
            console.log('打开有赞小程序成功', res);
          }
        })
      }, 1000)
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
  async onShow() {
    this.getLowCarbonSnacks()
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