// pages/memberManagement/memberManagement.js
/**
 * @Date: 2019-10-22 15:30:30
 * @LastEditors: 张浩玉
 */
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{
        name: "群主",        // 名称
        headUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLyEWO2T2BrgxhJdUcJgOWdvCdFDyG6831ROLzqW8DxAvM5ibPvHnY18S18JXib0qWZVbicxKrxg1lmQ/132",    // 头像
        isMajor: true    // 是否为群主
    },
    {
        name: "成员",
        headUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLyEWO2T2BrgxhJdUcJgOWdvCdFDyG6831ROLzqW8DxAvM5ibPvHnY18S18JXib0qWZVbicxKrxg1lmQ/132",
        isMajor: false
    },{
            name: "成员",
            headUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLyEWO2T2BrgxhJdUcJgOWdvCdFDyG6831ROLzqW8DxAvM5ibPvHnY18S18JXib0qWZVbicxKrxg1lmQ/132",
            isMajor: false
        }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dataId = options.dataId
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
   onShow () {
       console.log('2222',this.data.list)
    //const[list] = await Protocol.postMembers({id:this.dataId});
    this.setData({
        memberList:this.data.list
    })
  },
    async memberRemove(){
        await Protocol.postMembersDelete({groupId:this.data.groupId,memberId:this.data.memberId})
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
