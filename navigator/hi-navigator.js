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
  static navigateToResultData() {
    this.navigateTo({url: '/pages/result/result?isReport=true'});
  }
    //新人七日打卡礼
    static navigateToAttendanceBonus() {
      this.navigateTo({url: '/pagesIndex/attendanceBonus/attendanceBonus'});
    }
    //燃脂列表页（每天）
    static navigateToBurnDay() {
      this.navigateTo({url: '/pagesIndex/burnDay/burnDay'});
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
    static navigateToGuidance({reset,sharedId}) {
      this.navigateTo({url: `/pages/guidance/guidance?reset=${reset}&sharedId=${sharedId}`});
    }
    //我的减脂方案
    //参数fromPage  为1的时候从减脂方案页进入或需要处理的页面 为2的时候从个人信息页面进入需要单独处理 为0的时候从身高体重页进入
    static navigateToWeightTarget(fromPage=0) {
      this.navigateTo({url: `/pagesIndex/weightTarget/weightTarget?fromPage=${fromPage}`});
    }
    //燃脂方案解释
    static navigateToReduceFatExp() {
      this.navigateTo({url: `/pagesIndex/reduceFatExp/reduceFatExp`});
    }
    //燃脂宣言
    static navigateToManifesto({sharedId,flag}) {
      this.navigateTo({url: `/pagesIndex/manifesto/manifesto?sharedId=${sharedId}&flag=${flag}`});
    }
    //生成方案
    static navigateToReduceFat({weightGoalt}) {
      this.navigateTo({url: `/pagesIndex/reduceFat/reduceFat?weightGoalt=${weightGoalt}`});
    }
    //低碳饮食
    static switchToLowCarbon() {
      this.switchTab({url: `/pages/low-carbon/low-carbon`});
    }

    //低碳适应期
    static navigateToAdaptive() {
      this.navigateTo({url: `/pagesIndex/adaptive/adaptive`});
    }
    //低碳减脂期
    static navigateToReduceFatPeriod() {
      this.navigateTo({url: `/pagesIndex/reduceFatPeriod/reduceFatPeriod`});
    }
    
    //低碳巩固期
    static navigateToConsolidate() {
      this.navigateTo({url: `/pagesIndex/consolidate/consolidate`});
    }

    //盒子日额外补充
    static navigateToBoxReplenish() {
      this.navigateTo({url: `/pagesIndex/box-replenish/box-replenish`});
    }
    //领取优惠券
    static navigateToGetGift({couponCode,finishedPhone,id}) {
      this.navigateTo({url: `/pagesIndex/getGift/getGift?couponCode=${couponCode}&finishedPhone=${finishedPhone}&id=${id}`});
    }
    //领取低碳饮食
    static navigateTogetLowCarbon(bannerId) {
      this.navigateTo({url: `/pagesThree/get-low-carbon/get-low-carbon?bannerId=${bannerId}`});
    }
    //我的优惠券
    static navigateTocoupon() {
      this.navigateTo({url: '/pagesIndex/coupon/coupon'});
    }
     //引导加入减脂群
     static navigateToAddLowfatGroup() {
      this.navigateTo({url: `/pagesIndex/add-lowfat-group/add-lowfat-group`});
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
    //进入减脂报告
    static redirectToLowFatReport(reportId) {
      this.redirectTo({url: `/pages/lowFatReport/lowFatReport?reportId=${reportId}`});
    }

    //进入PPM解释
    static navigateToPPM(reportId) {
      this.navigateTo({url: `/pagesThree/ppm_explain/ppm_explain`});
    }
    //参考文献
    static navigateToLiterature() {
      this.navigateTo({url: `/pagesIndex/literature/literature`});
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
        this.switchTab({url: `/pages/set-info/set-info`});
    }

    static navigateTofood() {
        this.navigateTo({url: '/pages/food/food'})
    }
    //今日打卡报告进入记录页
    static navigateTofoodData() {
      this.navigateTo({url: '/pages/food/food?isReport=true'})
    }
    static relaunchToUpdatePage({binUrl, datUrl}) {
        getApp().otaUrl = arguments[0];
        this.navigateTo({url: '/pagesIndex/update/update'});
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
  static navigateIntroduce({couponCode}) {
    this.navigateTo({url: '/pages/introduce/introduce?couponCode='+couponCode});
  }
    static navigateToCalendar({type}) {
        this.navigateTo({url: '/pages/calendar/calendar?type=' + type});
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
      this.navigateTo({url: '/pagesIndex/reductionList/reductionList?groupId=' + groupId});
    }
    //圈子banner页面
    static navigateToBannerPage({url}) {
        this.navigateTo({url: '/pagesThree/bannerPage/bannerPage?url=' + url});
    }
    /*授权获取手机号*/
    static navigateToGetPhone({sharedId}) {
        this.navigateTo({url: '/pages/shareAddcommunity/getPhone/getPhone?sharedId=' + sharedId});
    }
    static navigateToPunchList({groupId}) {
        this.navigateTo({url: '/pagesIndex/punchList/punchList?groupId=' + groupId});
    }
    //减脂榜
   static navigateToFatBurningList({ groupId }) {
     this.navigateTo({ url: '/pagesIndex/fatBurningList/fatBurningList?groupId=' + groupId });
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
     * 进入外卖推荐
     */
    static navigateToTakeOutSelect() {
      this.navigateTo({url: '/pagesIndex/takeOutSelect/takeOutSelect'});
    }
    /**
     * 进入放纵餐页面
     */
    static navigateToIndulge() {
      this.navigateTo({url: '/pagesIndex/Indulge/Indulge'});
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
