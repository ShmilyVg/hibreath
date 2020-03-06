// pagesIndex/add-lowfat-group/add-lowfat-group.js
import Protocol from "../../modules/network/protocol";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {result} = await Protocol.getSupportStaff()
    this.setData({
      ...result
    })
    console.log('result',result)
  },
  //复制文字
   copyBtn(){
    var that = this;
    wx.setClipboardData({
      data: this.data.wechat,
      async success(res) {
        wx.showToast({
          title: '复制成功',
        });
        const {result} = await Protocol.getSupportStaffR({id:that.data.id})
        that.setData({
          ...result
        })
      }
    });
  },
//点击保存图片
  save () {
    let that = this
    //若二维码未加载完毕，加个动画提高用户体验
    wx.showToast({
      icon: 'loading',
      title: '正在保存图片',
      duration: 1000
    })
    //判断用户是否授权"保存到相册"
    wx.getSetting({
      success (res) {
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success () {//用户允许授权，保存图片到相册
              that.savePhoto();
            },
            fail () {//用户点击拒绝授权，引导用户授权
              wx.openSetting({
                success () {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.savePhoto();
                    }
                  })
                }
              })
            }
          })
        } else {//用户已授权，保存到相册
          that.savePhoto()
        }
      }
    })
  },
//保存图片到相册，提示保存成功
  savePhoto() {
    let that = this
    wx.downloadFile({
      url: that.data.wechatCode,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: "success",
              duration: 1000
            })
          }
        })
      }
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