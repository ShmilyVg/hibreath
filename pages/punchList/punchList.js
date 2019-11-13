// pages/punchList/punchList.js
import { getLatestOneWeekTimestamp } from "../../utils/time";
import Protocol from "../../modules/network/protocol";
import { whenDismissGroup } from "../community/social-manager";
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
        isShare: true,
        getSharedId: null,
        groupId: null
    },
    //切换标签页
    async selectTab(e) {
        let newtab = e.currentTarget.dataset.tabid;
        if (this.data.currenttab !== newtab) {
            this.setData({
                currenttab: newtab
            });
            const { getSharedId, groupId } = this.data;
            let resultData;
            if (newtab == 0) {
                resultData = await whenDismissGroup(Protocol.postAddup({ groupId, sharedId: getSharedId }));
            } else {
                resultData = await whenDismissGroup(Protocol.postContinual({ groupId, sharedId: getSharedId }));
            }

            const { result: { ranklist, rankNum, sharedId, inRank } } = resultData;
            this.setData({
                ranklist: ranklist,
                rankNum: rankNum,
                inRank: inRank,
                sharedId: sharedId
            })
        }
    },
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
            isShare: !sharedId,
        });

        const { result: { nickname, headUrl, groupName, sharedId, rankNum, addup, continual, ranklist, inRank } } = await whenDismissGroup(Protocol.postAddup({ groupId, sharedId: getSharedId }));
        this.setData({
            inRank: inRank,
            groupName: groupName,
            sharedId: sharedId,
            nickname: nickname,
            rankNum: rankNum,
            headUrl: headUrl,
            addup: addup,
            continual: continual,
            ranklist: ranklist
        })
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
                    title: '我在[' + this.data.groupName + ']共累积打卡' + this.data.addup + '天,当前排名第' + this.data.rankNum + '!',
                    path: '/pages/punchList/punchList?sharedId=' + this.data.sharedId
                }
            } else {
                return {
                    title: '我在[' + this.data.groupName + ']共累积打卡' + this.data.addup + '天,当前未上榜！再接再厉!',
                    path: '/pages/punchList/punchList?sharedId=' + this.data.sharedId
                }
            }

        } else {
            if (this.data.inRank) {
                return {
                    title: '我在[' + this.data.groupName + ']已连续打卡' + this.data.continual + '天,当前排名第' + this.data.rankNum + '!',
                    path: '/pages/punchList/punchList?sharedId=' + this.data.sharedId
                }
            } else {
                return {
                    title: '我在[' + this.data.groupName + ']已连续打卡' + this.data.continual + '天,当前未上榜！再接再厉!',
                    path: '/pages/punchList/punchList?sharedId=' + this.data.sharedId
                }
            }

        }
    }
})
