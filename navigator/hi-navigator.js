 /**
  * @Date: 2019-08-20 11:50:17
  * @LastEditors: 张浩玉
  */
import CommonNavigator from "heheda-navigator";

export default class HiNavigator extends CommonNavigator {

    // 跳转至结果页面 score得分 showUnscramble是否直接显示解读 situation场景值（可选） 检测时间戳 (可选)
    /*static navigateToResult({score, situation = 0, showUnscramble = false, timestamp = 0, success, fail, complete}) {
        let url = `/pages/result/result?score=${score}&situation=${situation}&showUnscramble=${showUnscramble}&timestamp=${timestamp}`;
        wx.navigateTo({url, success, fail, complete});
    }*/
    //吹气完成跳转结果页
    static navigateBlowToResult({id}) {
        this.navigateTo({url: '/pages/result/result?id=' + id});
    }
    static redirectToBlowToResult({id}) {
        this.redirectTo({url: '/pages/result/result?id=' + id});
    }

    static navigateToResult({fatText, fatTextEn, fatDes, score}) {
        this.navigateTo({url:`/pages/result/result?fatText=${fatText}&fatTextEn=${fatTextEn}&fatDes=${fatDes}&score=${score}`});
    }
    static navigateToResultNOnum() {
        this.navigateTo({url: '/pages/result/result'});
    }

    static relaunchToIndex({refresh = false} = {}) {
        getApp().globalData.refreshIndexPage = refresh;
        wx.redirectTo({url: '/pagesIndex/index/index'});
    }
    //准备日-视频打卡
    static navigateTofoodVideoclock({id,videoUrl}) {
        this.navigateTo({url: '/pagesIndex/foodVideoclock/foodVideoclock?id=' + id +'&videoUrl=' + videoUrl});
    }
    //运动-自由打卡
    static navigateToFreeClock() {
        this.navigateTo({url: '/pages/freeClock/freeClock'});
    }
    //运动-视频打卡
    static navigateToVideoClock({id}) {
        this.navigateTo({url: '/pages/videoClock/videoClock?id=' + id});
    }
    //查看课程
    static navigateToOnlyRaed({id}) {
        this.navigateTo({url: '/pages/videoClock/videoClock?id=' + id + '&isOnlyread=true'});
    }
    //完成打卡
    static navigateToFinishClock() {
        this.navigateTo({url: '/pages/finishClock/finishClock'});
    }
    //方案完成
    static navigateToPlanfinish({planId}) {
        this.navigateTo({url: '/pagesIndex/planfinish/planfinish?planId=' + planId});
    }
    //饮食打卡-发表动态
    static navigateToImgClock({id}) {
        this.navigateTo({url: '/pages/imgClock/imgClock?id=' + id});
    }
    //圈子-发表动态
    static navigateToImgClockcommunity({id}) {
        this.navigateTo({url: '/pages/imgClock/imgClock?groupId=' + id});
    }

/*    static navigateToHistory() {
        this.navigateTo({url: '/pages/history/history'});
    }*/
    //reLaunch 去除左上角返回
    static navigateToDeviceBind() {
        this.navigateTo({url: '/pagesIndex/device-bind/device-bind'});
    }


    static navigateToDeviceUnbind() {
        this.navigateTo({url: '/pages/device-manage/device-manage'});
    }

    static navigateToSetInfo() {
        this.navigateTo({url: '/pages/set-info/set-info'})
    }

    static switchToSetInfo() {
        this.switchTab({url: '/pages/set-info/set-info'});
    }
    static reLaunchToSetInfo() {
        this.reLaunch({url: '/pages/set-info/set-info'});
    }
    static navigateTofood() {
        this.navigateTo({url: '/pages/food/food'})
    }

    static relaunchToUpdatePage({binUrl, datUrl}) {
        getApp().otaUrl = arguments[0];
        this.navigateTo({url: '/pages/update/update'});
    }

    /*新加跳转*/
    static navigateSuccessInfo() {
        this.navigateTo({url: '/pages/successInfo/successInfo'})
    }
    static navigateToclickCheck() {
        this.navigateTo({url: '/pages/history/history'})
    }

    static navigateToPlan() {
        this.navigateTo({url: '/pages/plan/plan'})
    }
    static navigateTarget() {
        this.navigateTo({url: '/pages/setTarget/setTarget'})
    }


    static navigateToHIIT({id}) {
        this.navigateTo({url: '/pages/HIITInfo/HIITInfo?id=' + id})
    }

    static navigateTocookInfo({id}) {
        this.navigateTo({url: '/pages/cookInfo/cookInfo?id=' + id})
    }


   /* static navigatoResult({score}) {
        let url = `/pages/result/result?id=${score}`;
        wx.navigateTo({url});
    }*/

    static navigateIndexSuc({ data }) {
      this.navigateTo({ url: '/pagesIndex/index/index?isSuccessInfo=' + data });
    }

    static navigateIndex() {
        this.navigateTo({url: '/pagesIndex/index/index'});
    }


    static navigateToPPM() {
        this.navigateTo({url: '/pages/PPMInfo/PPMInfo'})
    }

    static navigateToCalendar({type}) {
        this.navigateTo({url: '/pages/calendar/calendar?type=' + type});
    }

    static redirectToFinishCheck({dataId, clockWay}) {
        this.redirectTo({url: '/pages/finishClock/finishClock?dataId=' + dataId + '&clockWay=' + clockWay});
    }
    static navigateToFinishCheck({dataId, clockWay}) {
        this.navigateTo({url: '/pages/finishClock/finishClock?dataId=' + dataId + '&clockWay=' + clockWay});
    }

    static redirectToFreeCheck({dataId}) {
        this.redirectTo({url: '/pages/freeClock/freeClock?dataId=' + dataId});
    }

    static navigateToMessageDetail({messageId}) {
        this.navigateTo({url: '/pages/message-detail/message-detail?messageId=' + messageId});
    }
    static redirectToMessageDetail({messageId,taskId}) {
        this.redirectTo({url: '/pages/message-detail/message-detail?messageId=' + messageId + '&taskId=' + taskId});
    }

    static navigateToFoodRuler() {
        this.navigateTo({url: '/pages/food-ruler/food-ruler'});
    }
    static navigateToCreateCommunity() {
        this.navigateTo({url: '/pages/createCommunity/createCommunity'});
    }
    static navigateToCommunityManagement() {
        this.navigateTo({url: '/pages/communityManagement/communityManagement'});
    }
    static navigateToMemberManagement({dataId}) {
        this.navigateTo({url: '/pages/memberManagement/memberManagement?dataId=' + dataId});
    }

    static switchToCommunity() {
        this.switchTab({url: '/pages/community/community'});
    }
    static navigateToReductionList({groupId}) {
        this.navigateTo({url: '/pages/reductionList/reductionList?groupId=' + groupId});
    }
    /*授权获取手机号*/
    static navigateToGetPhone({sharedId}) {
        this.navigateTo({url: '/pages/shareAddcommunity/getPhone/getPhone?sharedId=' + sharedId});
    }
    static navigateToPunchList({groupId}) {
        this.navigateTo({url: '/pages/punchList/punchList?groupId=' + groupId});
    }
    //减脂榜
   static navigateToFatBurningList({ groupId }) {
     this.navigateTo({ url: '/pages/fatBurningList/fatBurningList?groupId=' + groupId });
    }
    //七日减脂方案
   static navigateToCaseDetails({ schemaId }) {
     this.navigateTo({ url: '/pages/caseDetails/caseDetails?schemaId=' + schemaId });
    }
    //七日减脂方案详情
  static navigateToCaseDetailsInformation({ planId }) {
    this.navigateTo({ url: '/pages/caseDetailsInformation/caseDetailsInformation?planId=' + planId });
    }
  static navigateToSetup({ socialMemberInfo, currentSocial}) {
    this.navigateTo({ url: '/pages/set-up/set-up?socialMemberInfo=' + socialMemberInfo + '&currentSocial=' + currentSocial} );
    }
  static navigateToCircleInformation({ groupName }) {
    this.navigateTo({ url: '/pages/set-up/circleInformation/circleInformation?groupName=' + groupName });
  }
  static navigateToRename({ name }) {
    this.navigateTo({ url: '/pages/set-up/rename/rename?name=' + name });
  }
  static navigateToChangeCommunity({ groupId, name, imgUrl}) {
    this.navigateTo({ url: '/pages/createCommunity/createCommunity?groupId=' + groupId + '&name=' + name + '&imgUrl=' + imgUrl });
  }
  //自由日饮食原则
  static navigateToProgrammeDetails() {
    this.navigateTo({ url: '/pages/programmeDetails/programmeDetails'});
  }
  //动态信息列表
  static navigateToNoticeList({ groupId, total}) {
    this.navigateTo({ url: '/pagesIndex/noticeList/noticeList?groupId=' + groupId + '&total=' + total } );
  }

    /**
     * 前往派币页面
     */
    static navigateToPaiCoinPage() {
        this.navigateTo({ulr: '/pagesIndex/pai-coin/pain-coin'});
    }

  //减脂常见问题
  static navigateToCommonProblem() {
    this.navigateTo({ url: '/pagesIndex/commonProblem/commonProblem'});
  }
  //关于代餐
  static navigateToSubstituteMeal() {
    this.navigateTo({ url: '/pagesIndex/substituteMeal/substituteMeal' });
  }
  //食用代餐后的反应
  static navigateToReaction() {
    this.navigateTo({ url: '/pagesIndex/reaction/reaction' });
  }
  //减脂心里疏导
  static navigateToDredge() {
    this.navigateTo({ url: '/pagesIndex/dredge/dredge' });
  }
}
