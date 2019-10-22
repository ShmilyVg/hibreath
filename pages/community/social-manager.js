import Protocol from "../../modules/network/protocol";
import {getDynamicCreateTime} from "../../utils/time";
import {Toast} from "heheda-common-view";

class SocialGroupManager {
    constructor() {
        this._currentSocial = {};
        this._isChanged = false;
    }

    async getSocialGroupList() {
        const {result: {list: groupList}} = await Protocol.postMemberGroupList(), myGroup = [], otherGroup = [];
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
            const {result: {list: dynamicList}} = await Protocol.postGroupDynamicLatest({
                groupId,
                page: this._pageIndex
            });
            this._pageIndex++;
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

export {socialGroupManager as getSocialGroupManager, groupDynamicManager as getGroupDynamicManager};

