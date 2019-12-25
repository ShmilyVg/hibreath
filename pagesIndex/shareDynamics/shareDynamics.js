// pagesIndex/shareDynamics/shareDynamics.js
import Protocol from "../../modules/network/protocol";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrl:'',
      num:1,
      noData:true,
      dataTry:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log('options',options)
      this.setData({
          orderNumber:options.orderNumber,
          taskType:options.type
      })
      try{
          const{result} = await Protocol.postFoodChange({orderNumber:this.data.orderNumber,taskType:this.data.taskType})
          this.setData({
              noData:false,
              dataTry:true,
              imgUrl:result.url,
              orderNumber:result.orderNumber,
          })
      }catch(e){
          this.setData({
              dataTry:false,
          })
      }

      this.animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease'
      })
  },
    async change(){
        this.animation.rotate(360*this.data.num).step();
        this.setData({
            noData:true,
            num:this.data.num+1,
            rotate3dA: this.animation.export()
        })
        try{
            const{result} = await Protocol.postFoodChange({orderNumber:this.data.orderNumber,taskType:this.data.taskType})
            this.setData({
                noData:false,
                dataTry:true,
                imgUrl:result.url,
                orderNumber:result.orderNumber,
            })
        }catch (e) {
            this.setData({
                dataTry:false,
            })
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
