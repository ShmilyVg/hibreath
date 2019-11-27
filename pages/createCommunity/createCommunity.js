// pages/createCommunity/createCommunity.js
import {UploadUrl} from "../../utils/config";
// import {
//   getGroupDynamicManager,
//   getSocialGroupManager,
//   getSocialGroupMembersViewInfo,
//   judgeGroupEmpty,
//   whenDismissGroup
// } from "./social-manager";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {getSocialGroupManager} from "../community/social-manager";
import {Toast} from "heheda-common-view";
import * as tools from "../../utils/tools";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrl:'',
      name:'',
      disable:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.setData({
      groupId:options.groupId,
      name: options.name,
      imgUrl: options.imgUrl
    })
    console.log(this.data.groupId)
    console.log(this.data.name, this.data.imgUrl)
  },

  changeCommunityBtn:function(){
    Protocol.postChangeCommunity({ id: this.data.groupId, name: this.data.name, imgUrl: this.data.imgUrl}).then(data => {
      HiNavigator.switchToCommunity();
      console.log(1111)
    });
    console.log(this.data.groupId, this.data.name, this.data.imgUrl)
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

  },
    createCommunityInput(e){
        this.setData({
            name:tools.filterEmoji(e.detail.value)
        })
        this.disBtn();
    },
    async createCommunityBtn(){
        Toast.showLoading();
        const {result: {groupId}} = await Protocol.postgroup({name: this.data.name, imgUrl: this.data.imgUrl});
        getSocialGroupManager.currentSocial = {groupId};
        Toast.hiddenLoading();
        HiNavigator.switchToCommunity();
    },
    //控制完成按钮是否可以点击
    disBtn(){
      console.log('imgUrl', this.data.imgUrl)
        if(this.data.name == ''|| this.data.imgUrl=='' || !this.data.imgUrl){
            this.setData({
                disable:true
            })
        }else{
            this.setData({
                disable:false
            })
        }
    },
    // 上传图片
    addPic1: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                console.log(res)
                wx.showLoading({ // 添加loading状态
                    title: '上传中',
                })
                    wx.uploadFile({
                        url: UploadUrl,
                        filePath: res.tempFilePaths[0],
                        name: res.tempFilePaths[0],
                        success(res) {
                            wx.hideLoading()
                            var obj = JSON.parse(res.data)
                            console.log("res",obj)
                            that.setData({
                                imgUrl: obj.result.img_url
                            })
                            that.disBtn();
                        }
                    })
            }
        })
        //that.disBtn()

    }
})
