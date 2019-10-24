/**
 * @Date: 2019-10-16 17:21:47
 * @LastEditors: 张浩玉
 */
import HiNavigator from "../../navigator/hi-navigator";
import {Toast as toast, Toast, WXDialog} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import {PostUrl, UploadUrl} from "../../utils/config";
Page({

    data: {
        imgbox:[],
        imageUrl:[],
        disable:true
    },

    onLoad: function (e) {
        console.log(e,'e')
        this.taskId = e.id
    },
    async onShow () {
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
        Protocol.postFood({taskId:this.taskId,desc:this.data.desc,imgUrls:this.data.imgbox}).then(data => {
            HiNavigator.redirectToMessageDetail({messageId: data.result.id});
        });
    },
    //控制完成按钮是否可以点击
    disBtn(){
        if(this.data.desc || this.data.imgbox.length>0){
            this.setData({
                disable:false
            })
        }else{
            this.setData({
                disable:true
            })
        }
    },
    bindTextAreaBlur: function(e) {
        console.log("e",e.detail.value)
        this.setData({
            desc:filterEmoji(e.detail.value)
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

        wx.chooseImage({
            count: n, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                console.log(res)
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths

                if (9 > imgbox.length) {
                    if (imgbox.length == 0) {
                        imgbox = tempFilePaths
                    } else {
                        imgbox = imgbox.concat(tempFilePaths);
                    }
                    wx.showLoading({ // 添加loading状态
                        title: '上传中',
                    })
                    console.log("res",res)
                    if (res.tempFilePaths.length !== 1) {
                        for (var i = 0; i < res.tempFilePaths.length; i++) {
                            wx.uploadFile({
                                url: 'https://backend.hipee.cn/hipee-uploadtest/hibreath/mp/upload/image.do', // 接口地址
                                filePath: res.tempFilePaths[i], // 上传文件的临时路径
                                name: 'file',
                                success(res) {
                                    // 采用选择几张就直接上传几张，最后拼接返回的url
                                    wx.hideLoading()
                                    var obj = JSON.parse(res.data)
                                    console.log("obj",obj)
                                    var more = []
                                    more.push(obj.result.url)
                                    var tem = that.data.imageUrl
                                    that.setData({
                                        imageUrl: tem.concat(more)
                                    })
                                }
                            })
                        }
                    } else {
                        wx.uploadFile({
                            url: UploadUrl,
                            filePath: res.tempFilePaths[0],
                            name: res.tempFilePaths[0],
                            success(res) {
                                wx.hideLoading()
                                var obj = JSON.parse(res.data)
                                console.log(obj.result.img_url,"成功返回")
                                urlList.push(obj.result.img_url);
                                var tem = that.data.imageUrl
                                that.setData({
                                    imageUrl: tem.concat(urlList)
                                })
                                console.log("单一照片",that.data.imageUrl)
                            }
                        })
                    }
                } else {
                    //imgbox[picid] = tempFilePaths[0];
                }
                that.setData({
                    imgbox: imgbox
                });
                console.log("IMGBOX",that.data.imgbox)
                that.disBtn()
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
        this.data.imgbox.splice(e.currentTarget.dataset.deindex,1)
        this.setData({
            imgbox: this.data.imgbox,
        });
        this.disBtn()
    },
})
