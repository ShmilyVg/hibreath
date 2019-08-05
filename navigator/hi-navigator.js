import CommonNavigator from "heheda-navigator";

export default class HiNavigator extends CommonNavigator {

    // 跳转至结果页面 score得分 showUnscramble是否直接显示解读 situation场景值（可选） 检测时间戳 (可选)
    static navigateToResult({score, situation = 0, showUnscramble = false, timestamp = 0, success, fail, complete}) {
        let url = `/pages/result/result?score=${score}&situation=${situation}&showUnscramble=${showUnscramble}&timestamp=${timestamp}`;
        wx.navigateTo({url, success, fail, complete});
    }

    static relaunchToIndex({refresh = false} = {}) {
        getApp().globalData.refreshIndexPage = refresh;
        wx.reLaunch({url: '/pages/index/index'});
    }
    static navigateToStrategy() {
        this.navigateTo({url: '/pages/strategy/strategy'});
    }

/*    static navigateToHistory() {
        this.navigateTo({url: '/pages/history/history'});
    }*/

    static navigateToDeviceBind() {
        this.navigateTo({url: '/pages/device-bind/device-bind'});
    }

    static navigateToDeviceUnbind() {
        this.navigateTo({url: '/pages/device-manage/device-manage'});
    }

    static navigateToSetInfo() {
        this.navigateTo({url: '/pages/set-info/set-info'})
    }

    static relaunchToUpdatePage({binUrl, datUrl}) {
        getApp().otaUrl = arguments[0];
        this.reLaunch({url: '/pages/update/update'});
    }

    /*7.29 新加跳转*/

    static navigateToclickBody() {
        this.navigateTo({url: '/pages/set-info/set-info'})
    }
    static navigateToclickCheck() {
        this.navigateTo({url: '/pages/history/history'})
    }
    static navigateToclickMine() {
        this.navigateTo({url: '/pages/device-manage/device-manage'})
    }
    static navigateToBMIhistoryInfo() {
        this.navigateTo({url: '/pages/BMIhistoryInfo/BMIhistoryInfo'})
    }
    static navigateToBMIhistory() {
        this.navigateTo({url: '/pages/BMIhistory/BMIhistory'})
    }
    static navigateToPlan() {
        this.navigateTo({url: '/pages/plan/plan'})
    }
    static navigateTarget() {
        this.navigateTo({url: '/pages/setTarget/setTarget'})
    }
    static navigatePlanInfo() {
        this.navigateTo({url: '/pages/planInfo/planInfo'})
    }
    static navigateSuccessInfo() {
        this.navigateTo({url: '/pages/successInfo/successInfo'})
    }
    static navigateIndex() {
        wx.reLaunch({url: '/pages/index/index'});
    }
}
