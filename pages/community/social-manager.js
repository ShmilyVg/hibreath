import Protocol from "../../modules/network/protocol";
import {getDynamicCreateTime} from "../../utils/time";
import {Toast, WXDialog} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";

class SocialGroupManager {
    constructor() {
        this._currentSocial = {};
        this._isChanged = false;
    }

    async getSocialGroupList() {
        const {result: {list: groupList}} = await whenDismissGroup(Protocol.postMemberGroupList());
        // myGroup.push(...list.filter(item => item.isMajor));
        // otherGroup.push(...list.filter(item => !item.isMajor));
        if (!groupList.length) {
            this.currentSocial = {};
            return;
        }
        let currentSocialGroupId;
        try {
            currentSocialGroupId = wx.getStorageSync('currentSocialGroupId');
            console.log(currentSocialGroupId);
        } catch (e) {
            console.error('wx.getStorageSync(\'currentSocialGroupId\') error', e);
        }

        if (currentSocialGroupId) {
            for (let item of groupList) {
                if (currentSocialGroupId === item.groupId) {
                    this.currentSocial = item;
                    break;
                }
            }
        } else {
            this.currentSocial = groupList[groupList.length - 1];
        }
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
        Toast.showText('您当前未加入任何圈子');
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
    const {memberImgs, memberCount} = group;
    return {memberCount, memberImgs};
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
                    HiNavigator.switchToCommunity();
                }
            });
        }else if (code === 40012) {
            WXDialog.showDialog({
                title: '', content: '抱歉\n该圈子已解散', confirmText: '我知道了', confirmEvent: () => {
                    HiNavigator.switchToCommunity();
                }
            });
        }
        return Promise.reject(e);
    }
}

export {socialGroupManager as getSocialGroupManager, groupDynamicManager as getGroupDynamicManager};

