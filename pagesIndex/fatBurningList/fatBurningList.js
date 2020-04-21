// // pages/punchList/punchList.js
import { getLatestOneWeekTimestamp } from "../../utils/time";
import Protocol from "../../modules/network/protocol";
import { whenDismissGroup } from "../../pages/community/social-manager";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currenttab: '0',
    isShare: true,
    todayValue:null,
    cellColor:""
  },


  //切换标签页
  async selectTab(e) {
    let newtab = e.currentTarget.dataset.tabid;
    if (this.data.currenttab !== newtab) {
      this.setData({
        currenttab: newtab
      });
      if (this.data.getSharedId) {
        if (newtab == 0) {
          const { result: { sharedId, ranklist, rankNum, inRank, todayValue, dataDesc } } = await whenDismissGroup(Protocol.postBreathDay({ sharedId: this.data.getSharedId }));
          let ranklistF = this.filterFun(ranklist);
          this.setData({
            ranklist: ranklistF,
            sharedId: sharedId,
            inRank: inRank,
            rankNum: rankNum,
            todayValue: todayValue,
            dataDesc: dataDesc
          })
        } else {
          const { result: { sharedId, ranklist, rankNum, inRank} } = await whenDismissGroup(Protocol.postBreath({ sharedId: this.data.getSharedId }));
          let ranklistF = this.filterFun(ranklist);
          this.setData({
            ranklist: ranklistF,
            sharedId: sharedId,
            rankNum: rankNum,
            inRank: inRank
           
          })
        }
      } else {
        if (newtab == 0) {
          const { result: { sharedId, ranklist, rankNum, inRank, todayValue, dataDesc} } = await whenDismissGroup(Protocol.postBreathDay({ groupId: this.data.groupId }));
          let ranklistF = this.filterFun(ranklist);
          this.setData({
            ranklist: ranklistF,
            sharedId: sharedId,
            rankNum: rankNum,
            inRank: inRank,
            todayValue: todayValue,
            dataDesc: dataDesc
          })
        } else {
          const { result: { sharedId, ranklist, rankNum, inRank} } = await whenDismissGroup(Protocol.postBreath({ groupId: this.data.groupId }));
          let ranklistF = this.filterFun(ranklist);
          this.setData({
            ranklist: ranklistF,
            sharedId: sharedId,
            rankNum: rankNum,
            inRank: inRank,
            
          })
        }
      }

    }
    // console.log(this.data.dataDesc)
  },

  filterFun(arr){
    let nerArr =[];
    for(let item of arr){
      if (item.fieldValue < 40){
        nerArr.push(item)
      }
    }
    return nerArr;
  },
  // 
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log("options", options)
    if (!options) {
      return;
    }
    const { groupId, sharedId: getSharedId } = options;
    this.setData({
      groupId: options.groupId,
      getSharedId,
      isShare: !getSharedId,
    });

    const { result: { nickname, headUrl, groupName, sharedId, rankNum, todayValue, dataDesc, ranklist, inRank } } = await whenDismissGroup(Protocol.postBreathDay({ groupId, sharedId: getSharedId }));
    let ranklistF = this.filterFun(ranklist);
    this.setData({
      inRank: inRank,
      groupName: groupName,
      sharedId: sharedId,
      nickname: nickname,
      rankNum: rankNum,
      headUrl: headUrl,
      todayValue: todayValue,
      dataDesc: dataDesc,
      ranklist: ranklistF
    });

  },
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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
    if (this.data.currenttab == '0') {
      if (this.data.inRank) {
        return {
          title: '我在' + this.data.groupName + '今日减脂榜总排名第' + this.data.rankNum + '!快来围观!',
          path: '/pagesIndex/fatBurningList/fatBurningList?sharedId=' + this.data.sharedId
        }
      } else {
        return {
          title: '今日我在' + this.data.groupName + '减脂榜未能上榜！再接再厉！',
          path: '/pagesIndex/fatBurningList/fatBurningList?sharedId=' + this.data.sharedId
        }
      }

    } else {
      if (this.data.inRank) {
        return {
          title: '我在' + this.data.groupName + '累计减脂榜总排名第' + this.data.rankNum + '！快来围观！',
          path: '/pagesIndex/fatBurningList/fatBurningList?sharedId=' + this.data.sharedId
        }
      } else {
        return {
          title: '我在' + this.data.groupName + '累积减脂榜未能上榜！再接再厉！',
          path: '/pagesIndex/fatBurningList/fatBurningList?sharedId=' + this.data.sharedId
        }
      }

    }
  },


  
})
