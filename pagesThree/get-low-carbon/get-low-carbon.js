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
    this.setData({
      bannerId: options.bannerId
    })
    this.debounce = this.debounce();// 防抖函数，在此处初始化
  },
  async getLowCarbonSnacks(){
    let bannerId = this.data.bannerId;
    let data = {
      bannerId
    }
    let { result } = await Protocol.getLowCarbonSnacks(data);
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
  //函数节流 防止重复点击
    debounce : function () {
    var timeOut = null;
    return () => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.yzfn()
      }, 300);
    }
  },

  //跳转有赞
   async yzfn(){
     const { mpAppId, mpPath } = this.data.content;
     if (this.data.content.qualificationStatus == 2){
       let couponCode = this.data.content.couponCode;
       let youzan_info = await Protocol.takeGift({ couponCode });
       if (couponCode) {
         if (youzan_info.code == 1) {
           wx.showToast({
             title: '领取成功,即将跳转有赞小程序',
             icon: 'none',
             duration: 1200
           });
           setTimeout(() => {
             //跳转有赞小程序
             wx.navigateToMiniProgram({
               appId:mpAppId,
               path:mpPath,
               extraData: {
                 // foo: 'bar'
               },
               envVersion: 'develop',
               success: (res) => {
                 // 打开成功
                 console.log('打开有赞小程序成功', res);
               },
               fail(res){
                 console.log('打开有赞小程序失败', res);
               }
             })
           }, 1300)

         }
       }
     }else{
       wx.showToast({
         title: '即将跳转有赞小程序',
         icon: 'none',
         duration: 1200
       });
       setTimeout(() => {
         //跳转有赞小程序
         wx.navigateToMiniProgram({
           appId: mpAppId,
           path: mpPath,
           extraData: {
             // foo: 'bar'
           },
           envVersion: 'develop',
           success: (res) => {
             // 打开成功
             console.log('打开有赞小程序成功', res);
           }
         })
       }, 1300)
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