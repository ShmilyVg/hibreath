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
    },
    //切换标签页
    async selectTab(e) {
        let newtab = e.currentTarget.dataset.tabid;
        if (this.data.currenttab !== newtab) {
            this.setData({
                currenttab: newtab
            });
            if (newtab == 0) {
                const{result:{sharedId,ranklist,rankNum}}=await whenDismissGroup(Protocol.postWeightDay({groupId:this.data.groupId}));
                this.setData({
                    ranklist:ranklist,
                    sharedId:sharedId,
                    rankNum:rankNum
                })
            }else{
                const{result:{sharedId,ranklist,rankNum}}=await whenDismissGroup(Protocol.postWeight({groupId:this.data.groupId}));
                this.setData({
                    ranklist:ranklist,
                    sharedId:sharedId,
                    rankNum:rankNum,
                })
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad (options) {
        console.log(options)
        this.setData({
            groupId:options.groupId
        })
        const{result:{groupName,sharedId,nickname,headUrl,rankNum,todayDif,totalDif,ranklist}}=await whenDismissGroup(Protocol.postWeightDay({groupId:this.data.groupId}));
        this.setData({
            groupName:groupName,
            sharedId:sharedId,
            nickname:nickname,
            headUrl:headUrl,
            rankNum:rankNum,
            todayDif:todayDif,
            totalDif:totalDif,
            ranklist:ranklist
        })
    },

    /**
     *
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
                title: '我在'+'['+this.data.groupName+']'+'今日减重榜总排名第'+this.data.rankNum+'!快来围观!',
                path: '/pages/punchList/punchList?sharedId=' + this.data.sharedId
            }
        }else{
            return{
                title: '我在'+'['+this.data.groupName+']'+'累计减重榜总排名第'+this.data.rankNum+'！快来围观！',
                path: '/pages/reductionList/reductionList?sharedId=' + this.data.sharedId
            }
        }
    }
})
