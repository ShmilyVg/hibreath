 /**
  * @Date: 2019-08-20 11:50:17
  * @LastEditors: 张浩玉
  */
import CommonNavigator from "heheda-navigator";

export default class HiNavigator extends CommonNavigator {
    static redirectToBlowToResult({id,integral,inTaskProgress,integralTaskTitle}) {
        this.redirectTo({url: '/pages/result/result?id=' + id+'&integral=' + integral+'&inTaskProgress=' + inTaskProgress+'&integralTaskTitle=' + integralTaskTitle});
    }

    static navigateToResult({fatText, fatTextEn, fatDes, score}) {
        this.navigateTo({url:`/pages/result/result?fatText=${fatText}&fatTextEn=${fatTextEn}&fatDes=${fatDes}&score=${score}`});
    }
    static navigateToResultNOnum() {
        this.navigateTo({url: '/pages/result/result'});
    }
    //注册页面
    static navigateToGoRegister() {
        this.navigateTo({url: '/pages/goRegister/goRegister'});
    }
    //验证手机号页面
    static navigateToGoVerification() {
        this.navigateTo({url: '/pages/goVerification/goVerification'});
    }
    //验证群号
    static reLaunchToGroupNumber() {
      this.reLaunch({url: '/pages/groupNumber/groupNumber'});
    }
    //新手引导填写资料
    static navigateToGuidance({reset}) {
      this.navigateTo({url: `/pages/guidance/guidance?reset=${reset}`});
    }
    //燃脂历程
    static navigateToRecomTar({personalCenter}) {
      this.navigateTo({url: '/pages/recomTar/recomTar?personalCente='+personalCenter});
    }
    //新版燃脂历程
    static navigateToRecomTarNew() {
        this.navigateTo({url: '/pages/recomTar/recomTar'});
    }
    //进入减脂报告
    static navigateToLowFatReport(reportId) {
      this.navigateTo({url: `/pages/lowFatReport/lowFatReport?reportId=${reportId}`});
    }
    //参考文献
    static navigateToLiterature() {
      this.navigateTo({url: `/pagesIndex/literature/literature`});
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

    //reLaunch 去除左上角返回
    static navigateToDeviceBind() {
        this.navigateTo({url: '/pagesIndex/device-bind/device-bind'});
    }


    static navigateToDeviceUnbind() {
        this.navigateTo({url: '/pages/device-manage/device-manage'});
    }
    static switchToSetInfo() {
        this.switchTab({url: '/pages/set-info/set-info'});
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
    static navigateIndexSuc({ data }) {
      this.navigateTo({ url: '/pagesIndex/index/index?isSuccessInfo=' + data });
    }

    static navigateIndex() {
        this.navigateTo({url: '/pagesIndex/index/index'});
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
    static switchToPersonalCenter() {
        this.switchTab({url: '/pages/personalCenter/personalCenter'});
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
  //减脂怎么吃
  static navigateToHowEat() {
    this.navigateTo({ url: '/pagesIndex/howEat/howEat'} );
  }
  //代餐盒子
  static navigateToSlimpleBox({type,foodId}) {
    this.navigateTo({ url: '/pagesIndex/slimpleBox/slimpleBox?type=' + type+ '&foodId=' + foodId });
  }
  //外卖怎么选
  static navigateToTakeOut() {
    this.navigateTo({ url: '/pagesIndex/gdDay/gdDay'} );
  }
  //自由日饮食原则
  static navigateToProgrammeDetails() {
    this.navigateTo({ url: '/pages/programmeDetails/programmeDetails'});
  }
  //每日总结报告
  static navigateToDayReportConclude() {
    this.navigateTo({ url: '/pagesIndex/dayReportConclude/dayReportConclude'});
  }
  //燃脂精灵怎么用
  static navigateToSpirits({ taskId,isfinished}) {
    this.navigateTo({ url: '/pagesIndex/burnFatSpirits/burnFatSpirits?taskId=' + taskId + '&isfinished=' +isfinished} );
  }
  //减肥期间应该注意什么
  static navigateToAttention({ taskId,isfinished}) {
    this.navigateTo({ url: '/pagesIndex/lowFatAttention/lowFatAttention?taskId=' + taskId + '&isfinished=' +isfinished} );
  }
  //每天这么打卡？
  static navigateToHowRegister({ taskId,isfinished}) {
    this.navigateTo({ url: '/pagesIndex/howRegister/howRegister?taskId=' + taskId + '&isfinished=' +isfinished} );
  }
  //动态信息列表
  static navigateToNoticeList({ groupId}) {
    this.navigateTo({ url: '/pagesIndex/noticeList/noticeList?groupId=' + groupId} );
  }
  //动态信息列表
  static navigateToMyNoticeList() {
    this.navigateTo({ url: '/pagesIndex/noticeList/noticeList'} );
  }
  //个人中心-我的动态列表
  static navigateToMyDynamicList() {
    this.navigateTo({ url: '/pagesIndex/myDynamicList/myDynamicList'} );
  }

    /**
     * 前往积分页面
     */
    static navigateToPaiCoinPage() {
        this.navigateTo({ url: '/pagesIndex/pai-coin/pai-coin'});
    }

  //减脂常见问题
  static navigateToCommonProblem() {
    this.navigateTo({ url: '/pagesIndex/commonProblem/commonProblem'});
  }
  //关于常见问题子页面subList
  static navigateToSubList({id,title}) {
    this.navigateTo({ url: '/pagesIndex/subList/subList?id='+id+'&title='+title});
  }
    //关于常见问题子页面subList详情页
    static navigateToDetailsList({detailsid,pageTitle}) {
        this.navigateTo({ url: '/pagesIndex/detailsList/detailsList?detailsid='+detailsid+'&pageTitle='+pageTitle});
    }

    /**
     * 进入个人信息页面
     */
    static navigateToUserInfoPage() {
        this.navigateTo({url: '/pagesIndex/user-info/user-info'});
    }

    /**
     * 进入目标体重页面
     */
    static navigateToTargetWeight({targetWeight}) {
        this.navigateTo({url: '/pagesIndex/target-weight/target-weight?targetWeight=' + targetWeight});
    }
    /**
     * 进入饮食推荐页面
     */
    static navigateTorecommendation() {
        this.navigateTo({url: '/pagesIndex/food-recommendation/food-recommendation'});
    }
    /**
     * 进入饮食详情页面
     */
    static navigateToFooddetails({foodId}) {
        this.navigateTo({url: '/pagesIndex/food-details/food-details?foodId='+ foodId});
    }
    /**
     * 分享动态
     */
    static navigateToShareDynamics({type,orderNumber}) {
        this.navigateTo({url: '/pagesIndex/shareDynamics/shareDynamics?type='+ type+'&orderNumber='+orderNumber});
    }
}
