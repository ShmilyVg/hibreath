// pagesIndex/weightTarget/weightTarget.js
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideModal_w: true,
    animationData:'',
    weightGoalt:null,
    result:{},
    showModalStatus:false
  },
  onLoad: function (options) {
    this.initMyLossfatCourse();
  },
  onShow: function () {

  },
   onShareAppMessage() {
    return {
      title: this.data.shareTitle,
      path: `/pagesIndex/weightTarget/weightTarget?sharedId=${this.data.sharedId}`,
      imageUrl: this.data.shareImg
    };
  },
  async initMyLossfatCourse(){
    let weightGoalt = this.data.weightGoalt
    let data = weightGoalt ? { weightGoalt: Number(weightGoalt) } : {};
    let { result } = await Protocol.initMyLossfatCourse(data);
    this.setData({
      result
    })
  },
  async startPlan(){
    let weightGoalt = this.data.weightGoalt;
    let data = weightGoalt ? { weightGoalt: Number(weightGoalt) } : {};
    let { result} = await Protocol.postMembersJoinSchema(data)
    HiNavigator.navigateToManifesto({sharedId:result.sharedId})
  },
  goReduceFat(){
    HiNavigator.navigateToReduceFat();
  },
  goReduceFatExp(){
    HiNavigator.navigateToReduceFatExp();
  },
  weightGoalChange(e) {
    let targetDate = this.data.result
    let nowW = targetDate.weightLoss + targetDate.weightGoalt;
    let weightGoalt = e.detail.value;
    if (nowW <= weightGoalt) {
      toast.warn('目标体重过大')
    }
    let str = (weightGoalt + '').split('.')[1];

    if (str && str.length > 1) {
      toast.warn('只能一位小数')
      weightGoalt = Number(weightGoalt).toFixed(1);
    }
    this.setData({
      weightGoalt: weightGoalt
    })
  },
  saveWeight() {
    this.initMyLossfatCourse();
    this.hideModal();
  },
  // 显示遮罩层
  async showModal_w() {
    var that = this;
    that.setData({
      weightGoalt: '',
      hideModal_w: false
    })
    var animation_w = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation_w = animation_w
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal_w: function () {
    var that = this;
    var animation_w = wx.createAnimation({
      duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation_w = animation_w
    that.fadeDown();//调用隐藏动画
    setTimeout(function () {
      that.setData({
        hideModal_w: true
      })
    }, 720)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation_w.translateY(0).step()
    this.setData({
      animationData_w: this.animation_w.export()
    })
  },
  fadeDown: function () {
    this.animation_w.translateY(300).step()
    this.setData({
      animationData_w: this.animation_w.export(),
    })
  },
  handlerGobackClick() {
    HiNavigator.switchToSetInfo();
  },
  //展开分享
  async showModal() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(500).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    });
    setTimeout(
      function () {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export()
        });
      }.bind(this),
      200
    );
    const {result} = await Protocol.getTaskInfoBySharedId({sharedId:this.data.result.sharedId,sharedType:"initialHeart"});
    this.setData({
      shareTitle:result.sharePoster.toFriend.title,
      shareImg:result.sharePoster.toFriend.url,
      groupImg:result.sharePoster.toGroup.url1
    })
    console.log('result',result)
  },
//分享至朋友圈
  downShareImg() {
    let that = this
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
  savePhoto(){
    var that = this;
    let url = this.data.groupImg;
    wx.downloadFile({
      url,
      success: function (res) {
        wx.saveImageToPhotosAlbum({　　　　　　　　　//保存到本地
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '图片已保存至相册，请到朋友圈选择图片发布！',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }, fail() {
        wx.showToast({
          title: '图片保存失败，请重试！',
          icon: 'none',//
          duration: 2000
        })
      }, complete() {
        that.hideModal()
      }
    })
  },
  hideModal: function () {
    this.setData({
      showModalStatus: false
    });
  },
})