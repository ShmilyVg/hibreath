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
    desc: '',
    imgOverSize:[],
    imgTypeErr:[]
  },

  onLoad: function (e) {
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
    if (this.submitBtn) {
      return;
    }
    this.submitBtn = true;
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
    this.setData({
      disable: !(imgbox.length > 0 || desc.match(/^\s*$/) == null)
    })
  },
  textBindblur(e) {
    this.setData({
      desc: tools.filterEmoji(e.detail.value)
    })
    this.disBtn()
  },
  bindTextAreaBlur: function (e) {

  },
  // 上传图片 &&&


  async addPic1(e) {
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
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFiles;
        if (tempFilePaths) {
          wx.showLoading({ // 添加loading状态
            title: '上传中',
            mask: true
          })
          let arr = [], pathArr = [], imgOverSize = [], imgTypeErr = [];
          let typeImgs = ['png', 'jpeg', 'gif', 'jpg']
          console.log('tempFilePaths', tempFilePaths)
          for (let i = 0; i < tempFilePaths.length; i++) {
            let item = tempFilePaths[i];
            let path = item.path;

            let typeArr = path.split('.');
            let typeImg = typeArr[typeArr.length - 1];
            if (item.size > 3912600) {
              imgOverSize.push(i + 1)
              console.log('图片信息', item.size, path)
              that.setData({
                imgOverSize
              })
              continue;
            } else if (typeImgs.indexOf(typeImg) == -1) {
              imgTypeErr.push(i + 1)
              that.setData({
                imgTypeErr
              })
              continue;
            }

            arr.push(new Promise(function (resolve, reject) {
              wx.uploadFile({
                url: UploadUrl, // 接口地址
                filePath: path, // 上传文件的临时路径
                name: 'file',
                success(res) {
                  var imgbox = that.data.imgbox;
                  console.log('uploadFile调用成功后的返回', res, res.data)
                  // 采用选择几张就直接上传几张，最后拼接返回的url
                  try {
                    var obj = JSON.parse(res.data)
                    // console.log("obj", obj)
                    imgbox.push(path)
                    var more = []
                    more.push(obj.result.img_url)
                    // console.log(more, 'more')
                    var tem = that.data.imageUrl
                    that.setData({
                      imageUrl: tem.concat(more),
                      imgbox
                    })
                    that.disBtn()
                  } catch (e) {
                    console.log('uploadFile调用成功后的返回但是没有data', res)
                  }
                },
                fail(err) {
                  // console.log("uploadFile:", err)
                },
                complete() {
                  resolve()
                }
              })
              // wx.compressImage({
              //   src: path, // 图片路径
              //   quality: 60, // 压缩质量
              //   fail(res) {
              //     pathArr.push([path, path,'fail'])
              //     // console.log('调用压缩接口失败', res)
              //   },
              //   success(res) {
              //     pathArr.push([path, res.tempFilePath, 'success'])
              //     path = res.tempFilePath
              //     // console.log('压缩成功后的返回', res)
              //   },
              //   complete() {

              //     // that.uploadFileFun(path);
              //   }
              // })
            }))
          }

          Promise.all(arr).then(res => {
            console.log('路径数组', pathArr);
            setTimeout(() => {
              wx.hideLoading();
              that.imgTypeErrFun()
              return true
            }, 500)
          })

        }
      },
    })
  },
  imgTypeErrFun() {
    let that = this;
    let imgTypeErr = this.data.imgTypeErr;
    if (!imgTypeErr.length) {
      this.imgOverSizeFun();
      return true;
    }
    let str = imgTypeErr.join('、');
    wx.showModal({
      title:'提示',
      content: `您上传的第${str}张格式不支持，仅支持PNG、JPEG、JPG、GIF格式的图片`,
      showCancel: false,
      success(res) {
        that.setData({
          imgTypeErr: []
        })
        that.imgOverSizeFun()
      }
    })
  },
  imgOverSizeFun() {
    let that = this;
    let imgOverSize = this.data.imgOverSize;
    if (!imgOverSize.length) return true;
    let str = imgOverSize.join('、');
    wx.showModal({
      title: '提示',
      content: `您上传的第${str}张图片太大,请重新上传或直接发表剩余图片`,
      showCancel: false,
      success(res) {
        that.setData({
          imgOverSize: []
        })
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
    this.popup.showPopup();
    this.setData({
      ifShow: !this.data.ifShow
    })
  },

  //取消事件
  _error() {
    this.popup.hidePopup();
    this.setData({
      ifShow: !this.data.ifShow
    })
  },
  //确认事件
  async _success(e) {
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
