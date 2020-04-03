import {Network} from "./network/index";
import BaseNetworkImp from "./network/libs/base/base-network-imp";
export default class Protocol {

    // /**
    //  * 示例
    //  * @param friendId
    //  */
    // static postExample({friendId}) {
    //     return Network.request({url: 'user/friend/example', data: {friendId}});
    // }

    static getAccountInfo() {
        return Network.request({url: 'account/info'});
    }

    static getBreathDataAdd({dataValue}) {
        return Network.request({url: 'breathData/add', data: {dataValue}});
    }

    static getBreathDataList({page, pageSize = 15, timeBegin, timeEnd}) {
        return Network.request({url: 'breathData/list', data: {page, pageSize,timeBegin,timeEnd}})
    }

    static getAnalysisNotes() {
        return Network.request({url: 'analysis/notes'})
    }

    //设备绑定相关
    static getDeviceBindInfo() {
        return Network.request({url: 'device/bind/info'})
    }

    static postDeviceBind({deviceId, mac}) {
        return Network.request({url: 'device/bind', data: {deviceId, mac}});
    }

    //设备绑定相关
    static postDeviceUnbind({deviceId}) {
        return Network.request({url: 'device/unbind', data: {deviceId}});
    }

    //上传身体评估信息
    static postBreathPlanAnalysis(data) {
        return Network.request({url: 'breathPlan/analysis', data: data})
    }

    static postBreathDataSync({items}) {
        return Network.request({url: 'breathData/sync', data: {items}});
    }
    //获取用餐方式
    static postMealType() {
        return Network.request({url: 'settings/mealType'});
    }

    //视频打卡页数据
    static postHIIT(data) {
        return Network.request({url: 'sport/info', data: data})
    }

    //准备日视频打卡完成
    static postFoodvideo(data) {
        return Network.request({url: 'task/commonFinish', data: data})
    }
    //视频打卡完成
    static postHIITFin(data) {
        return Network.request({url: 'task/sportvideo', data: data})
    }

    //上传身体指标
    static setBodyIndex(data) {
        return Network.request({url: 'task/bodyIndex', data: data})
    }

    // 减脂目标
    static postSettingsGoals() {
        return Network.request({url: 'settings/goals'})
    }

    // 保存成员减脂宣言
    static putGoalDesc(data) {
        return Network.request({url: 'members/putGoalDesc',data})
    }

    //首页打卡分享
    static postSharetask(data) {
        return Network.request({url: 'members/share/task',data:data})
    }
    // 获取首页分享封面图
    static postPosters() {
        return Network.request({url: 'poster/getNowLosefatDataPosters'})
    }
    //饮食打卡心灵鸡汤
    static getSoul() {
        return Network.request({url: 'settings/soul'})
    }
    //饮食打卡上传
    static postFood(data) {
        return Network.request({url: 'dynamic/publish', data})
    }
    //创建圈子
    static postgroup(data) {
        return Network.request({url: 'group/post', data})
    }
    //获取圈子成员
    static postMembers(data) {
        return Network.request({url: 'group/members', data})
    }
    //移除圈子成员
    static postMembersDelete(data) {
        return Network.request({url: 'group/members/delete', data})
    }
    static postMembersPut(data) {
        return Network.request({url: 'members/put', data})
    }

    static postItemCalendar({startTime, endTime, type}) {
        return Network.request({url: `${type}/item_calendar`, data: {startTime, endTime}});
    }

    static postMembersTasks() {
        return Network.request({url: 'members/tasks'})
    }
    //获取补卡页面信息
    static getTaskInfoBySharedId({sharedType,sharedId}) {
      return Network.request({url: 'index/getTaskInfoBySharedId',data: {sharedType,sharedId}})
    }
    //首页-天天燃脂签到
    static getBreathSignInInfo() {
        return Network.request({url: 'members/getBreathSignInInfo'})
    }

    //首页-天天燃脂签到-补签
    static putBreathSign(data) {
        return Network.request({url: 'members/putBreathSignInByHelpMember',data})
    }

    //获取首页任务
    static getTaskInfo() {
        return Network.request({url: 'index/taskInfo'})
    }
    //获取首页banner
    static getBannerList() {
        return Network.request({url: 'index/bannerList'})
    }

    //方案完成荣誉报告
    static postPlanFinish({planId,sharedId}) {
        return Network.request({url: 'members/plan/finishInfo',data: {planId,sharedId}})
    }
    //退出方案
    static postMembersExit({planId}) {
        return Network.request({url: 'members/plan/exit',data: {planId}})
    }
  static postMembersJoinSchema({ weightGoal}) {
    return Network.request({ url: 'members/joinSchema', data: { weightGoal}})
    }

    static postSettingsLosefatSchema() {
        return Network.request({url: 'settings/losefatSchema'})
    }

    static postBreathDatalist() {
        return Network.request({url: 'breathData/dateList'});
    }

    static postBreathDateTimeItem(data) {
        return Network.request({url: 'breathData/dateTimeItem',data});
    }

    static postWeightDataAdd({weight: dataValue}) {
        return Network.request({url: 'weightData/add', data: {dataValue}})
    }

    static postHeartDataAdd({heart: dataValue}) {
        return Network.request({url: 'heartData/add', data: {dataValue}})
    }

    static postBloodPressureDataAdd({high: height, low}) {
        return Network.request({url: 'bloodPressureData/add', data: {height, low}})
    }

    static postWeightDataList({page, pageSize = 20}) {
        return Network.request({url: 'weightData/list', data: {page, pageSize}})
    }

    static postWeightDataListAll(data) {
        return Network.request({url: 'weightData/listAll',data});
    }

    static postBloodPressureDataListAll(data) {
        return Network.request({url: 'bloodPressureData/listAll', data});
    }

    static postHeartDataListAll(data) {
        return Network.request({url: 'heartData/listAll', data});
    }

    static postTaskSportStyle({freestyleIds, duration, feelDesc, calorie, id = ''}) {
        return Network.request({url: 'task/sportstyle', data: arguments[0]});
    }

    static postSettingsSportStyle() {
        return Network.request({url: 'settings/sportstyle'});
    }

    static postSportDataInfo({id}) {
        return Network.request({url: 'sportdata/info', data: {id}});
    }

    static postSportDataPut({freestyleIds, duration, feelDesc, calorie, id = ''}) {
        return Network.request({url: 'sportdata/put', data: arguments[0]});
    }

    static postSportDataPutFeel({feelDesc, feelEn, id}) {
        return Network.request({url: 'sportdata/putfeel', data: arguments[0]});
    }

    static postDynamicInfo({id}) {
        return Network.request({url: 'dynamic/info', data: {id}});
    }

    static postDynamicDelete({id}) {
        return Network.request({url: 'dynamic/delete', data: arguments[0]});
    }

    /**
     * 圈子动态
     * @param groupId
     * @param timestamp
     * @returns {*|Promise|Promise<any>}
     */
    static postGroupDynamicLatest({groupId, page, pageSize = 5}) {
        return Network.request({url: 'group/dynamic/lastest', data: arguments[0]});
    }

    /**
     * 我的圈子
     * @returns {*|Promise|Promise<any>}
     */
    static postMemberGroupList() {
        return Network.request({url: 'members/group/list'});
    }

    /**
     * 退出圈子
     * @param groupId
     * @returns {*|Promise|Promise<any>}
     */
    static postMemberGroupExit({groupId}) {
        return Network.request({url: 'members/group/exit', data: arguments[0]});
    }

    /**
     * 圈子详情
     * @param id
     * @returns {*|Promise|Promise<any>}
     */
    static postGroupInfo({groupId: id}) {
        return Network.request({url: 'group/info', data: {id}}).then(res => Promise.resolve({...res, groupId: id}));
    }

    /**
     * 获取圈子分享信息
     * @param sharedId
     * @returns {*|Promise|Promise<any>}
     */
    static postGroupShareInfo({sharedId}) {
        return Network.request({url: 'group/shareInfo', data: arguments[0]});
    }

    /**
     * 加入圈子
     * @param sharedId
     * @returns {*|Promise|Promise<any>}
     */
    static postGroupJoin({sharedId}) {
        return Network.request({url: 'group/join', data: arguments[0]});
    }
    //打卡榜-累计打卡
    static postAddup({groupId, sharedId}) {
        return Network.request({url: 'ranklist/clockin/addup',data:{groupId, sharedId}});
    }
    //打卡榜-连续打卡
    static postContinual({groupId, sharedId}) {
        return Network.request({url: 'ranklist/clockin/continual',data:{groupId, sharedId}});
    }
    //减重榜-累计减重
    static postWeight({groupId,sharedId}) {
        return Network.request({url: 'ranklist/weight/addup',data:{groupId,sharedId}});
    }
    //减重榜-今日减重
    static postWeightDay({groupId,sharedId}) {
        return Network.request({url: 'ranklist/weight/day',data:{groupId,sharedId}});
    }
    //减脂榜-今日减脂
   static postBreathDay({ groupId, sharedId }) {
     return Network.request({ url: 'ranklist/breath/day', data: { groupId, sharedId } });
    }
    //减脂榜-累计减脂
   static postBreath({ groupId, sharedId }) {
     return Network.request({ url: 'ranklist/breath/addup', data: { groupId, sharedId } });
    }

    //圈子-发表动态
    static postPublish(data) {
        return Network.request({url: 'group/dynamic/publish', data})
    }
    //圈子banner
    static postBanner() {
      return Network.request({url: 'group/banner'});
    }


    /**
     * 任务分享-分享详情
     * @param {sharedId} param0
     */
    static postTaskSharedInfo({sharedId}){
        return Network.request({url: 'members/share/taskInfo', data:{sharedId}})
    }
    //优惠礼包
    static getGift({couponId}) {
        return Network.request({url: 'coupon/fetchinfo', data:{couponId}})
    }
  //领取低碳饮食
  static getLowCarbonSnacks(){
    return Network.request({url: 'lowCarbonMeal/getLowCarbonSnacks'})
  }
  //领取优惠券takeGift
  static takeGift({couponId,executeOrder}) {
    return Network.request({url: 'coupon/takeCouponOnBreathSignIn', data:{couponId,executeOrder}})
  }

  static getShoppingJumpCodes(){
        return Network.request({url: 'coupon/getShoppingJumpCodes'})
    }
    //低碳饮食-减脂历程
    static getLossfatCourse() {
        return Network.request({url: 'lowCarbonMeal/getLossfatCourse'})
    }
    
    //低碳饮食-盒子怎么吃
    static getBoxHowToEat() {
        return Network.request({url: 'lowCarbonMeal/getBoxHowToEat'})
    }

    //低碳饮食-每日可额外补充
    static getAdditionalMeal() {
        return Network.request({url: 'lowCarbonMeal/getAdditionalMeal'})
    }
    //低碳饮食-低碳日怎么吃
    static getLowCarbonDayHowToEat() {
        return Network.request({url: 'lowCarbonMeal/getLowCarbonDayHowToEat'})
    }
    //微信客服信息
    static getSupportStaff() {
        return Network.request({url: 'supportStaff/get'})
    }
    //刷新获取客服信息
    static getSupportStaffR({id}) {
        return Network.request({url: 'supportStaff/refresh', data: {id}})
    }
    //七日减脂方案
    static fatReducingScheme({ schemaId }) {
     return Network.request({ url: 'losefatSchema/info', data: {schemaId}});
    }
    //七日减脂方案详情
   static getFatReducingScheme({ planId }) {
     return Network.request({ url: 'losefatSchema/get', data: { planId } });
    }
    //更改圈子名字
  static postUpdataMember({ name,groupId }) {
    return Network.request({ url: 'group/member/update', data: { name, groupId } });
    }
    //圈子-动态-点赞
    static postGiveHeart({dynamicId}){
        return Network.request({url: 'group/dynamic/giveLike', data:{dynamicId}})
    }

    //圈子-动态-取消点赞
    static postNoHeart({dynamicId}){
        return Network.request({url: 'group/dynamic/abandonLike', data:{dynamicId}})
    }
    //圈子-评论-添加评论
    static postAddComment({dynamicId,content,commentId}){
        return Network.request({url: 'group/dynamic/addComment', data:{dynamicId,content,commentId}})
    }
    //圈子-评论-评论列表
    static postCommentList({dynamicId,pageSize}){
        return Network.request({url: 'group/dynamic/commentList', data:{dynamicId,pageSize}})
    }
    //圈子-评论-删除评论
    static postDeletecomment({commentId}){
        return Network.request({url: 'group/dynamic/delComment', data:{commentId}})
    }
    //修改圈子信息
    static postChangeCommunity({ id, name, imgUrl=''}) {
      return Network.request({ url: 'group/put', data: { id, name, imgUrl } })
    }
    //打卡激励信息
    static postIncentive() {
        return Network.request({url: 'members/task/incentive'});
    }
    //获取电话号码
    static getPhoneNum({encryptedData, iv}) {
        return new Promise((resolve, reject) =>
            this.wxLogin().then(res => {
                const {code} = res;
                return BaseNetworkImp.request({
                    url: 'account/getphoneNum',
                    data: {code, encrypted_data: encryptedData, iv},
                    requestWithoutLogin: true
                })
            }).then(data => {
                resolve(data.result.phoneNumber);
            }).catch(res => {
                console.log('getPhoneNum failed:', res);
                reject(res);
            })
        )
    }

    //保存电话号码
    static putPhoneNum({encryptedData, iv}) {
        return new Promise((resolve, reject) =>
            this.wxLogin().then(res => {
                const {code} = res;
                return BaseNetworkImp.request({
                    url: 'members/putPhoneNum',
                    data: {code, encrypted_data: encryptedData, iv},
                    requestWithoutLogin: true
                })
            }).then(data => {
                resolve(data);
            }).catch(res => {
                console.log('getPhoneNum failed:', res);
                reject(res);
            })
        )
    }

    static wxReLogin(resolve, reject) {
        wx.login({
            success: resolve, fail: res => {
                WXDialog.showDialog({
                    title: '糟糕', content: '抱歉，目前小程序无法登录，请稍后重试', confirmEvent: () => {
                        this.wxReLogin(resolve, reject);
                    }
                });
                console.log('wx login failed', res);
            }
        })
    }

    static wxLogin() {
        return new Promise((resolve, reject) =>
            this.wxReLogin(resolve, reject)
        );
    }
    //删除体重记录
  static postDeleteWeightData({ id}) {
      return Network.request({ url: 'weightData/delete', data: { id } })
    }
    //删除血压记录
  static postDeleteBloodPressureData({ id }) {
      return Network.request({ url: 'bloodPressureData/delete', data: { id } })
    }
    //删除心率记录
  static postDeleteHeartData({ id }) {
      return Network.request({ url: 'heartData/delete', data: { id} })
    }
  //删除燃脂记录
  static postDeleteBreathData({ id }) {
    return Network.request({ url: 'breathData/delete', data: { id } })
  }
  //圈子通知列表
  static postDynamicNotice({ page  , groupId , pageSize = 15 }) {
    return Network.request({ url: 'group/dynamic/notice', data: { page, groupId, pageSize } })
  }
  //我的 圈子通知列表
  static postDynamicNoticeMembers({ page  , pageSize = 15 }) {
    return Network.request({ url: 'members/dynamic/notice', data: { page,pageSize } })
  }
  //圈子通知清除
  static postNoticeUpdate() {
    return Network.request({ url: 'group/dynamic/notice/delAll'})
  }
  //圈子修改成员所有通知为已读
  static postNoticeUpdateAll() {
    return Network.request({ url: 'group/dynamic/notice/updateAll' })
  }
  //新手引导
    static postGuidance(data) {
        return Network.request({url: 'members/put',data:data});
    }
    //完成新手引导
    static finishedGuide() {
        return Network.request({url: 'members/finishedGuide'});
    }
    //我的减脂历程目标
    static getMyLossfatCourse(data) {
        return Network.request({url: 'members/getMyLossfatCourse', data: data});
    }
    //重新生成我的减脂历程目标
    static initMyLossfatCourse(data) {
        return Network.request({url: 'members/initMyLossfatCourse', data: data});
    }
    //减脂报告
    static getTodayLosefatReport({sharedId,reportId}) {
        return new Promise((resolve, reject) =>{
            return Network.request({url: '/members/createTodayLosefatReport', data:{sharedId,reportId}}).then(data => {
                resolve(data);
            }).catch(res => {
                reject(res);
            })
        })

    }

    //个人中心-获取每日减脂报告分页列表
    static getTodayLosefatReportListPage(data){
        return Network.request({ url: '/members/getTodayLosefatReportListPage',data:data })
    }

    //成员新手任务列表
    static postIntegralSingle() {
        return Network.request({url: 'integral/single'});
    }

  //成员每日任务列表
  static postIntegralDaily() {
      return Network.request({url: 'integral/daily'});
  }
    //成员积分明细
    static postIntegralDetail({type}) {
        return Network.request({url: 'integral/detail', data: {page: 1, pageSize: 100, type}});
    }

    //成员领取奖励
    static postIntegralReceive({id}) {
        return Network.request({url: 'integral/receive', data: {id}});
    }

    /**
     * 获取信息收集
     * @returns {*|Promise|Promise<unknown>}
     */
    static getUserDetailInfo() {
        return Network.request({url: 'members/infoDetail'});
    }
    //个人中心
    static postMemberInfo() {
        return Network.request({url: 'members/info'});
    }


    //个人中心常见问题
    static getSettingsHelp({id:pid}) {
        return Network.request({url: 'settings/help', data: {pid}});
    }
    //个人中心常见问题
    static getSettingsHelpInfo({id}) {
        return Network.request({url: 'settings/helpInfo', data: {id}});
    }
    //我的动态列表
    static postMydynamicList({ page  , pageSize = 15 }) {
        return Network.request({url: 'members/dynamicList',data: { page,pageSize}});
    }
    /**
     * 个人信息更新
     * @returns {*|Promise|Promise<unknown>}
     */
    static postMembersPutInfo(data) {
        return Network.request({url: 'members/putInfo', data});
    }
    //食物详情
    static postFoodFoodInfo({ foodId }) {
        return Network.request({url: 'food/foodInfo',data: {foodId}});
    }
    //减脂饮食推荐-内容
    static postFoodItemInfo(data) {
        return Network.request({url: 'food/plaItemInfo',data});
    }
    //减脂饮食推荐-日期
    static postFoodDateInfo() {
        return Network.request({url: 'food/dateInfo'});
    }
    //饮食打卡-换一换
    static postFoodChange(data) {
        return Network.request({url: 'lowCarbonMeal/changeFood',data});
    }
    //新版饮食推荐
    static postMenuRecommend() {
      return Network.request({url: 'lowCarbonMeal/getRecommendedFatLossRecipes'});
    }
    //减脂食材清单列表（种类）
    static getFoodMaterialsList(){
      return Network.request({url: 'lowCarbonMeal/getFoodMaterialsList'});
    }
    //减脂食材清单（详情）
    static searchFood(data){
      return Network.request({url: 'lowCarbonMeal/searchFood',data});
    }

  //好物推荐
    static postConversionInfo({page = 1, pageSize = 10} = {}) {
        return Network.request({url: 'conversion/info', data: {page, pageSize}});
    }
    //生成海报
    static postPostersChange({orderNumber,taskType}) {
        return Network.request({url: 'poster/getNowLosefatTaskTypeDataPosters',data: {orderNumber,taskType}});
    }
    //获取手机验证码
    static getSmsCode(data) {
      return Network.request({url: 'account/getSmsCode',data});
    }
    //提交手机验证码
    static postPhone(data) {
      return Network.request({url: 'account/confirmSmsCode',data});
    }
    //加入燃脂圈
    static postJoinGroup(data) {
      return Network.request({url: 'group/joinGroup',data});
    }
    //减脂怎么吃
    static getHowtoEat(data) {
      return Network.request({url: 'food/howToEat',data});
    }
    //代餐详情
    static getMealInfo(data) {
      return Network.request({url: 'food/mealInfo',data});
    }
    //获取答题题目数据
    static getAnswer() {
        return Network.request({url: 'answerData/getAnswer'});
    }
    //完成答题打卡
    static answerFinish(data) {
        return Network.request({url: 'answerData/answerFinish',data});
    }
    // 额外补充食物
    static extraData(data) {
        return Network.request({url: 'food/extraData',data});
    }
    //放纵餐怎么吃
    static Indulge(data) {
      return Network.request({url: 'lowCarbonMeal/getIndulgeMealHowToEat',data});
    }
    // 获取我的优惠券
    static getCouponListPage({page, limit = 8,isUsed,isExpired}) {
    return Network.request({url: 'coupon/getCouponListPage', data: {page,limit,isUsed,isExpired}});
  }
}
