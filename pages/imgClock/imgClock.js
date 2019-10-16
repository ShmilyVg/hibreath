/**
 * @Date: 2019-10-16 17:21:47
 * @LastEditors: 张浩玉
 */
import HiNavigator from "../../navigator/hi-navigator";
 import {Toast as toast} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import {PostUrl, UploadUrl} from "../../utils/config";
Page({

    data: {
        imgbox:[],
        imageUrl:[]
    },

    onLoad: function () {

    },
    async onShow () {
        const {result}= await Protocol.getSoul()
        this.setData({
            tag:result.tag,
            description:result.description,
        })
    },
    submit(){
        console.log("imgbox",this.data.imgbox)
        console.log("imageUrl",this.data.imageUrl)
        Protocol.postFood().then(data => {

        });
    },
    bindTextAreaBlur: function(e) {
        console.log(e.detail.value)
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
        /*
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                Toast.showLoading();
                let path = res.tempFilePaths[0];
                wxp.uploadFile({
                    url: 'https://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do',
                    filePath: path,
                    name: path
                }).then((res: any) => {
                    console.log(res);
                    Toast.hiddenLoading();
                    let data = res.data;
                    let image = JSON.parse(data).result.img_url;
                    console.log('图片：', image);
                    that.setDataSmart({
                        portraitUrl: image
                    })
                })
            }
        }*/
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
                                url: 'https://backend.hipee.cn/hipee-upload/hibox/mp/upload/image.do', // 接口地址
                                filePath: res.tempFilePaths[i], // 上传文件的临时路径
                                name: 'file',
                                success(res) {
                                    // 采用选择几张就直接上传几张，最后拼接返回的url
                                    wx.hideLoading()
                                    var obj = JSON.parse(res.data)
                                    var more = []
                                    more.push(obj.url)
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
                                console.log(obj,"成功返回")
                                urlList.push(obj.result.img_url);
                                var tem = that.data.imageUrl
                                that.setData({
                                    imageUrl: tem.concat(urlList)
                                })
                            }
                        })
                    }
                } else {
                    imgbox[picid] = tempFilePaths[0];
                }
                that.setData({
                    imgbox: imgbox
                });
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
    deleteImg: function (e) {
        var that = this;
        var images = that.data.uploadedImages;
        that.setData({
            uploadedImages: images,
            imgBoolean: true
        });
    },
})
