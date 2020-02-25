/**
 * @Date: 2019-10-16 17:21:47
 * @LastEditors: 张浩玉
 */
import HiNavigator from "../../navigator/hi-navigator";
import {
  Toast as toast,
  Toast,
  WXDialog
} from "heheda-common-view";
import { whenDismissGroup } from "../community/social-manager";
import Protocol from "../../modules/network/protocol";
import {
  PostUrl,
  UploadUrl
} from "../../utils/config";
import * as tools from "../../utils/tools";
const app = getApp();
Page({

  data: {
    imgbox: [],
    imageUrl: [],
    disable: true,
    ifShow: true,
    desc: ''
  },

  onLoad: function (e) {
    console.log(e, 'e')
    if (e.id) {
      this.taskId = e.id
    } else {
      this.groupId = e.groupId
    }
    this.setData({
      groupId: this.groupId
    })
  },
  async onShow() {
    console.log(888888888)
    this.imgNum = 0;
    getApp().globalData.issueRefresh = true
    const {
      result
    } = await Protocol.getSoul()
    this.setData({
      tag: result.tag,
      description: result.description,
    })
  },
  showDialog(content) {
    WXDialog.showDialog({
      title: '小贴士',
      content,
      confirmText: '我知道了'
    });
  },
  async submit() {
    if (this.submitBtn){
      return;
    }
    this.submitBtn = true;
    console.log("imgbox", this.data.imgbox)
    console.log("imageUrl", this.data.imageUrl)
    /*  if(this.data.imgbox.length == 0 && this.data.imgbox.desc == undefined){
          this.showDialog("请选择照片");
          return
      }*/
    if (this.taskId) {
      // Toast.showLoading();
      // Protocol.postFood({taskId:this.taskId,desc:this.data.desc,imgUrls:this.data.imageUrl}).then(data => {
      //     Toast.showLoading();
      //     HiNavigator.redirectToMessageDetail({messageId: data.result.id});
      // });
      this.showPopup();
      this.submitBtn = false;
    } else {
      wx.showLoading({ // 添加loading状态
        title: '请稍后......',
        mask: true
      })
      const { result } = await whenDismissGroup(Protocol.postPublish({ groupId: this.data.groupId, desc: this.data.desc, imgUrls: this.data.imageUrl }))
      this.submitBtn = false;
      setTimeout(() => {
        wx.hideLoading();
      }, 500)
      //任务信息全局储存 圈子页面使用
      app.globalData.isImgClock = true
      app.globalData.publishObj.inTaskProgress = result.inTaskProgress
      app.globalData.publishObj.integral = result.integral
      app.globalData.publishObj.integralTaskTitle = result.integralTaskTitle
      /*  app.globalData.dtinTaskProgress = result.inTaskProgress
        app.globalData.integral = result.integral
        app.globalData.integralTaskTitle = result.integralTaskTitle*/
      HiNavigator.switchToCommunity();
    }
    app.globalData.isScrollTopNum = true
  },
  //控制完成按钮是否可以点击
  disBtn() {
    const {
      desc,
      imgbox
    } = this.data;
    //console.log('test.match(/^[ ]*$/)',desc.match(/^\s*$/))
    //console.log('desc', this.data)
    this.setData({
      disable: !(imgbox.length > 0 || desc.match(/^\s*$/) == null)
    })
  },
  textBindblur(e) {
    console.log("失去焦点后打印", e.detail.value)
    this.setData({
      desc: tools.filterEmoji(e.detail.value)
    })
    this.disBtn()
  },
  bindTextAreaBlur: function (e) {
    console.log("聚焦输入时打印", e.detail.value)
    /*console.log("e2222", tools.filterEmoji(e.detail.value))*/
    /*this.setData({
      desc: tools.filterEmoji(e.detail.value)
    })*/

  },
  // 上传图片 &&&
  addPic1: function (e) {
    var imgbox = this.data.imgbox;
    var that = this;
    
    var n = 9;
    var urlList = []
    if (9 > imgbox.length > 0) {
      n = 9 - imgbox.length;
    } else if (imgbox.length == 9) {
      n = 1;
    }

    if (n <= 0) {
      return;
    }

    wx.chooseImage({
      count: n, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log("选中图片res", res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFiles;

        if (tempFilePaths) {
          wx.showLoading({ // 添加loading状态
            title: '上传中',
            mask: true
          })
          
          tempFilePaths.forEach(({
            path,
            size
          }) => {
            console.log('forEach', path)
            wx.compressImage({
              src: path, // 图片路径
              quality: 60, // 压缩质量
              fail(res) {
                console.log('调用压缩接口失败', res)
                that.setData({
                  compressImg: path
                })
              },
              success(res) {
                that.setData({
                  compressImg: res.tempFilePath
                })
                console.log('压缩成功后的返回', res)

                console.log('that.data.compressImg', that.data.compressImg)
              },
              complete() {
                that.uploadFileFun(imgbox, path);
              }
            })

          })
        }
        console.log("IMGBOX", that.data.imgbox)
      },
    })


  },

  uploadFileFun(imgbox, path) {
    var that = this;
    wx.uploadFile({
      url: UploadUrl, // 接口地址
      filePath: that.data.compressImg, // 上传文件的临时路径
      name: 'file',
      success(res) {
        console.log('uploadFile调用成功后的返回', res)
        // 采用选择几张就直接上传几张，最后拼接返回的url
        imgbox.push(path)
        that.setData({
          compressImg: ''
        })
        var obj = JSON.parse(res.data)
        console.log("obj", obj)
        var more = []
        more.push(obj.result.img_url)
        console.log(more, 'more')
        var tem = that.data.imageUrl
        that.setData({
          imageUrl: tem.concat(more),
          imgbox
        })
        console.log('照片imageUrl', that.data.imageUrl)
        console.log('照片imgbox', that.data.imgbox)
        that.disBtn()
      },
      fail(err) {
        console.log("uploadFile:", err)
      },
      complete() {
        if (++that.imgNum == that.data.imgbox.length) {
          setTimeout(() => {
            wx.hideLoading();
          }, 1000)
        }
      }
    })
  },
  // 点击预览大图
  previewImage(e) {
    var current = this.data.imgbox[e.target.dataset.index]
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imgbox // 需要预览的图片http链接列表
    })
  },
  //删除图片
  imgDelete: function (e) {
    console.log(e.currentTarget.dataset.deindex, 'e')
    console.log(this.data.imgbox, 'eeee')
    this.data.imageUrl.splice(e.currentTarget.dataset.deindex, 1)
    this.setData({
      imgbox: [].concat(this.data.imageUrl),
    });
    this.disBtn()
  },


  onReady: function () {
    //获得popup组件
    this.popup = this.selectComponent("#popup");
  },

  showPopup(e) {

    console.log(e)
    this.popup.showPopup();
    this.setData({
      ifShow: !this.data.ifShow
    })
  },

  //取消事件
  _error() {
    console.log('你点击了取消');
    this.popup.hidePopup();
    this.setData({
      ifShow: !this.data.ifShow
    })
  },
  //确认事件
  async _success(e) {
    console.log('你点击了确定', e);
    const {
      detail: {
        groupId
      }
    } = e;
    this.setData({
      groupId: groupId
    })
    this.popup.hidePopup();
    Toast.showLoading();
    this.setData({
      ifShow: !this.data.ifShow
    })
    const { result } = await whenDismissGroup(Protocol.postPublish({ groupId: this.data.groupId, taskId: this.taskId, desc: this.data.desc, imgUrls: this.data.imageUrl }))
    Toast.showLoading();
    HiNavigator.redirectToMessageDetail({
      messageId: result.id,
      taskId: this.taskId
    });
  }

})
