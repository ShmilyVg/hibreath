import Protocol from "../../modules/network/protocol";
import {getDynamicCreateTime} from "../../utils/time";
import {Toast, WXDialog} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
import {getSocialGroupManager} from "social-manager";
class SocialGroupManager {
    constructor(Page) {
        this._currentSocial = {};
    }

    async getSocialGroupList() {
        console.log('currentSocialGroupId',wx.getStorageSync('currentSocialGroupId'))
        if(wx.getStorageSync('currentSocialGroupId')){
          console.log('我执行了1')
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
        console.log('当前圈子ID',socialGroupManager.currentSocial.groupId)
        const {groupId} = socialGroupManager.currentSocial;
        if (groupId) {
            const {result: {list: dynamicList,notice: noticeList}} = await whenDismissGroup(Protocol.postGroupDynamicLatest({
                groupId,
                page: this._pageIndex
            }));
            wx.setStorageSync('noticeList', noticeList);
           console.log('noticeList',noticeList,wx.getStorageSync('noticeList'))
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
    console.log('222000')
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
                    wx.removeStorageSync('currentSocialGroupId')
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
                    wx.removeStorageSync('currentSocialGroupId')
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
        }else if (code === 40013) {
            Toast.hiddenLoading()
            WXDialog.showDialog({
                title: '', content: '您上传的图片包含违规违法内容，\n请修改后重新上传', confirmText: '我知道了', confirmEvent: () => {
                }
            });
        }else if (code === 40014) {
            Toast.hiddenLoading()
            WXDialog.showDialog({
                title: '', content: '您上传的文字包含违规违法内容，\n请修改后重新上传', confirmText: '我知道了', confirmEvent: () => {
                }
            });
        }else if (code === 40015) {
          Toast.hiddenLoading()
          WXDialog.showDialog({
            title: '', content: '验证码错误', confirmText: '我知道了', confirmEvent: () => {
            }
          });
        }else if (code === 40016) {
          Toast.hiddenLoading()
          WXDialog.showDialog({
            title: '', content: '群号错误', confirmText: '我知道了', confirmEvent: () => {
            }
          });
        }else if (code === 40017) {
          Toast.hiddenLoading()
          WXDialog.showDialog({
            title: '', content: 'Slimple群号错误，请重新填写', confirmText: '我知道了', confirmEvent: () => {
            }
          });
        }else if (code === 40018) {
          Toast.hiddenLoading()
          WXDialog.showDialog({
            title: '', content: '验证码发送失败,请重试', confirmText: '我知道了', confirmEvent: () => {
            }
          });
        }else if (code === 40019) {
          Toast.hiddenLoading()
          WXDialog.showDialog({
            title: '', content: '验证码失效请重试', confirmText: '我知道了', confirmEvent: () => {
            }
          });
        }
        return Promise.reject(e);
    }
}
export {socialGroupManager as getSocialGroupManager, groupDynamicManager as getGroupDynamicManager};

