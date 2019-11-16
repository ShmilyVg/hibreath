import Protocol from "../../modules/network/protocol";
import {getDynamicCreateTime} from "../../utils/time";
import {Toast, WXDialog} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
import {getSocialGroupManager} from "social-manager";
class SocialGroupManager {
    constructor(Page) {
        console.log('pp',Page)
        console.log('SocialGroupManager',SocialGroupManager)
        this._currentSocial = {};
    }

    async getSocialGroupList() {
        console.log('getStorageSync1',wx.getStorageSync('deviceId'))
        if(wx.getStorageSync('currentSocialGroupId')){
            await whenDismissGroup(Protocol.postGroupInfo({groupId: wx.getStorageSync('currentSocialGroupId')}));
        }
        const {result: {list: groupList}} = await whenDismissGroup(Protocol.postMemberGroupList());
        if (!groupList.length) {
            this.currentSocial = {};
            console.log('未加入圈子')
            return;
        }

        let currentSocialGroupId;
        currentSocialGroupId = wx.getStorageSync('currentSocialGroupId');
        console.log('currentSocialGroupIdcurrentSocialGroupId',currentSocialGroupId)
        if (currentSocialGroupId) {
            for (let item of groupList) {
                if (currentSocialGroupId === item.groupId) {
                    this.currentSocial = item;
                    currentSocialGroupId = currentSocialGroupId;
                    return;
                }
            }
            for (let item of groupList) {
                if (currentSocialGroupId !== item.groupId) {
                    await whenDismissGroup(Protocol.postGroupInfo({groupId: currentSocialGroupId}));
                    this.currentSocial = groupList[0];
                    currentSocialGroupId = groupList[0].groupId;
                    return;
                }
            }
        }
        console.log('11',groupList)
        this.currentSocial = groupList[0];
        currentSocialGroupId = groupList[0].groupId;

    }


/*
        let currentSocialGroupId;
        currentSocialGroupId = wx.getStorageSync('currentSocialGroupId');
        if(currentSocialGroupId){
            for (let item of groupList) {
                if (currentSocialGroupId === item.groupId) {
                    this.currentSocial = item;
                    currentSocialGroupId = currentSocialGroupId;
                    return
                }
            }
            for (let item of groupList) {
                if (currentSocialGroupId !== item.groupId) {
                    await whenDismissGroup(Protocol.postGroupInfo({groupId: currentSocialGroupId}));
                    return
                    /!* if (!groupList.length) {
                         this.currentSocial = {};
                         return;
                     }else{
                         this.currentSocial = groupList[0];
                         currentSocialGroupId = groupList[0].groupId;
                         return
                     }*!/

                }
            }
        }

        this.currentSocial = groupList[0];
        currentSocialGroupId = groupList[0].groupId;*/


    get currentSocial() {
        return this._currentSocial;
    }

    set currentSocial(value) {
        this._currentSocial = value;
        wx.setStorageSync('currentSocialGroupId', value.groupId);
    }

}

const socialGroupManager = new SocialGroupManager();

class GroupDynamicManager {
    constructor() {
        this.clear();
    }

    clear() {
        this._pageIndex = 1;
    }

    async getGroupDynamicList() {
        const {groupId} = socialGroupManager.currentSocial;
        if (groupId) {
            const {result: {list: dynamicList}} = await whenDismissGroup(Protocol.postGroupDynamicLatest({
                groupId,
                page: this._pageIndex
            }));
            if (dynamicList.length) {
                this._pageIndex++;
            }
            return dynamicList.map(item => {
                return {...item, messageCreateTime: getDynamicCreateTime(item.createTimestamp)};
            })
        }
        return [];
    }
}

const groupDynamicManager = new GroupDynamicManager();

export function judgeGroupEmpty() {
    const {groupId} = socialGroupManager.currentSocial;
    if (groupId) {
        return Promise.resolve({groupId});
    } else {
        console.log('未加入圈子')
        wx.showToast({
            title: '您当前未加入任何圈子',
            icon: 'none',
            duration: 3000
        })
        return Promise.reject();
    }
}

export async function getSocialGroupMembersViewInfo() {
    const {result: group} = await whenDismissGroup(Protocol.postGroupInfo({groupId: socialGroupManager.currentSocial.groupId}));
    if (group.memberImgs) {
        group.memberImgs = group.memberImgs.slice(0, 3);
    } else {
        group.memberImgs = [];
    }
    const {memberImgs, memberCount,isMajor,sharedId,name,memberName} = group;
    return {memberCount, memberImgs,isMajor,sharedId,name,memberName};
}

export async function whenDismissGroup(protocol) {
    try {
        return await protocol;
    } catch (e) {
        console.error(e);
        const {code} = e.data;
        if (code === 40011) {
            WXDialog.showDialog({
                title: '', content: '抱歉\n您已被移除该圈子', confirmText: '我知道了', confirmEvent: () => {
                    wx.clearStorageSync('currentSocialGroupId')
                    wx.switchTab({
                        url: '../community/community',
                        success: function (e) {
                            var page = getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onShow();
                        }
                    })
                    HiNavigator.switchToCommunity();
                    //getSocialGroupManager.getSocialGroupList()
                }
            });
        }else if (code === 40012) {
            WXDialog.showDialog({
                title: '', content: '抱歉\n该圈子已解散', confirmText: '我知道了', confirmEvent: () => {
                    wx.clearStorageSync('currentSocialGroupId')
                    wx.switchTab({
                        url: '../community/community',
                        success: function (e) {
                            var page = getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onShow();
                        }
                    })
                }
            });
        }
        return Promise.reject(e);
    }
}

export {socialGroupManager as getSocialGroupManager, groupDynamicManager as getGroupDynamicManager};

