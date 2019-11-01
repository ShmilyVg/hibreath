// pages/punchList/punchList.js
import {getLatestOneWeekTimestamp} from "../../utils/time";
import Protocol from "../../modules/network/protocol";
import {whenDismissGroup} from "../community/social-manager";
/**
 * @Date: 2019-10-28 16:25:49
 * @LastEditors: 张浩玉
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
      currenttab: '0',
      isShare:true
  },
    //切换标签页
    async selectTab(e) {
        let newtab = e.currentTarget.dataset.tabid;
        if (this.data.currenttab !== newtab) {
            this.setData({
                currenttab: newtab
            });
            if(this.data.getSharedId){
                if (newtab == 0) {
                    const{result:{ranklist,rankNum,sharedId,inRank}}=await whenDismissGroup(Protocol.postAddup({sharedId:this.data.getSharedId}));
                    this.setData({
                        ranklist:ranklist,
                        rankNum:rankNum,
                        inRank:inRank,
                        sharedId:sharedId
                    })
                }else{
                    const{result:{ranklist,rankNum,sharedId,inRank}}=await whenDismissGroup(Protocol.postContinual({sharedId:this.data.getSharedId}));
                    this.setData({
                        ranklist:ranklist,
                        rankNum:rankNum,
                        inRank:inRank,
                        sharedId:sharedId
                    })
                }
            }else{
                if (newtab == 0) {
                    const{result:{ranklist,rankNum,sharedId,inRank}}=await whenDismissGroup(Protocol.postAddup({groupId:this.data.groupId}));
                    this.setData({
                        ranklist:ranklist,
                        rankNum:rankNum,
                        inRank:inRank,
                        sharedId:sharedId
                    })
                }else{
                    const{result:{ranklist,rankNum,sharedId,inRank}}=await whenDismissGroup(Protocol.postContinual({groupId:this.data.groupId}));
                    this.setData({
                        ranklist:ranklist,
                        rankNum:rankNum,
                        inRank:inRank,
                        sharedId:sharedId
                    })
                }
            }

        }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
      console.log(options)
      if(options.groupId){
          this.setData({
              groupId:options.groupId
          })
          const{result:{nickname,headUrl,groupName,sharedId,rankNum,addup,continual,ranklist,inRank}}=await whenDismissGroup(Protocol.postAddup({groupId:this.data.groupId}));
          this.setData({
              inRank:inRank,
              groupName:groupName,
              sharedId:sharedId,
              nickname:nickname,
              rankNum:rankNum,
              headUrl:headUrl,
              addup:addup,
              continual:continual,
              ranklist:ranklist
          })
      }else if(options.sharedId){
          this.setData({
              getSharedId:options.sharedId,
              isShare:false
          })
          const{result:{nickname,headUrl,groupName,sharedId,rankNum,addup,continual,ranklist,inRank}}=await whenDismissGroup(Protocol.postAddup({sharedId:this.data.getSharedId}));
          this.setData({
              inRank:inRank,
              groupName:groupName,
              sharedId:sharedId,
              nickname:nickname,
              rankNum:rankNum,
              headUrl:headUrl,
              addup:addup,
              continual:continual,
              ranklist:ranklist
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
  onShow(){

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
      if(this.data.currenttab == '0'){
              return{
                  title: '我在'+'['+this.data.groupName+']'+'累计打卡榜总排名第'+this.data.rankNum+'!快来围观!',
                  path: '/pages/punchList/punchList?sharedId=' + this.data.sharedId
              }
      }else{
          return{
              title: '我在'+'['+this.data.groupName+']'+'连续打卡榜总排名第'+this.data.rankNum+'！快来围观！',
              path: '/pages/punchList/punchList?sharedId=' + this.data.sharedId
          }
      }
  }
})
