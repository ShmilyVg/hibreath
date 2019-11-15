/**
 * @Date: 2019-10-16 17:21:47
 * @LastEditors: 张浩玉
 */
import HiNavigator from "../../navigator/hi-navigator";
import {Toast as toast, Toast, WXDialog} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import {PostUrl, UploadUrl} from "../../utils/config";
import * as tools from "../../utils/tools";
Page({

    data: {
        imgbox:[],
        imageUrl:[],
        disable:true
    },

    onLoad: function (e) {
        console.log(e,'e')
        if(e.id){
            this.taskId = e.id
        }else{
            this.groupId = e.groupId
        }

    },
    async onShow () {
        wx.onMemoryWarning(function () {
            console.log('onMemoryWarningReceive')
        })
        const {result}= await Protocol.getSoul()
        this.setData({
            tag:result.tag,
            description:result.description,
        })
    },
    showDialog(content) {
        WXDialog.showDialog({title: '小贴士', content, confirmText: '我知道了'});
    },
    submit(){
        console.log("imgbox",this.data.imgbox)
        console.log("imageUrl",this.data.imageUrl)
        console.log("132",this.data.desc)
      /*  if(this.data.imgbox.length == 0 && this.data.imgbox.desc == undefined){
            this.showDialog("请选择照片");
            return
        }*/
        Toast.showLoading();
      if(this.taskId){
          Protocol.postFood({taskId:this.taskId,desc:this.data.desc,imgUrls:this.data.imageUrl}).then(data => {
              Toast.showLoading();
              HiNavigator.redirectToMessageDetail({messageId: data.result.id});
          });
      }else {
          Protocol.postPublish({groupId:this.groupId,desc:this.data.desc,imgUrls:this.data.imageUrl}).then(data => {
              Toast.showLoading();
              HiNavigator.switchToCommunity();
          });
      }

    },
    //控制完成按钮是否可以点击
    disBtn(){
        const {desc, imgbox} = this.data;
        //console.log('test.match(/^[ ]*$/)',desc.match(/^\s*$/))
        console.log('desc',this.data)
        this.setData({
            disable: !(imgbox.length>0 ||desc.match(/^\s*$/) == null)
        })
    },
    bindTextAreaBlur: function(e) {
        console.log("e11",e.detail.value)
        console.log("e2222",tools.filterEmoji(e.detail.value))
        this.setData({
            desc:tools.filterEmoji(e.detail.value)
        })
        this.disBtn()
    }
    ,
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

        if(n <=0){
            return;
        }

        wx.chooseImage({
            count: n, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                console.log("res",res)
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFiles;

                if (tempFilePaths) {
                    wx.showLoading({ // 添加loading状态
                        title: '上传中',
                    })
                    tempFilePaths.forEach(({path, size})=>{
                        if(size > 5*1024*1024){// 小于5M
                            toast.showText("原图不能超过5M");
                            return;
                        }
                        wx.uploadFile({
                            url: UploadUrl, // 接口地址
                            filePath: path, // 上传文件的临时路径
                            name: 'file',
                            success(res) {
                                // 采用选择几张就直接上传几张，最后拼接返回的url
                                imgbox.push(path)
                                wx.hideLoading()
                                var obj = JSON.parse(res.data)
                                console.log("obj",obj)
                                var more = []
                                more.push(obj.result.img_url)
                                console.log(more,'more')
                                var tem = that.data.imageUrl
                                that.setData({
                                    imageUrl: tem.concat(more),
                                    imgbox
                                })
                                console.log('照片',that.data.imageUrl)
                                that.disBtn()
                            },
                            fail(err){
                                console.log("uploadFile:", err)
                            }
                        })
                    })
                }
                console.log("IMGBOX",that.data.imgbox)
            },
            fail: function (res) {
                console.log("相机调用失败",res)
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
        console.log(e.currentTarget.dataset.deindex,'e')
        console.log(this.data.imgbox,'eeee')
        this.data.imageUrl.splice(e.currentTarget.dataset.deindex,1)
        this.setData({
            imgbox: this.data.imageUrl,
        });
        this.disBtn()
    },
})
