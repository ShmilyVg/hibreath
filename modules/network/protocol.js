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

    static getHistoryList({userId = 123}) {
        return Network.request({url: 'user/history', data: {userId}});
    }

    static getAnalysisSituation() {
        return Network.request({url: 'analysis/situation'})
    }

    static getAnalysisFetch({dataValue, situation}) {
        return Network.request({url: 'analysis/fetch', data: {dataValue, situation}})
    }

    static getBreathDataAdd({dataValue, situation}) {
        return Network.request({url: 'breathData/add', data: {dataValue, situation}});
    }

    /* static getBreathDataAdd({dataValue}) {
         return Network.request({url: 'breathData/add', data: {dataValue}});
     }*/
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

    static postBreathDataSetSituation({id, situation}) {
        return Network.request({url: 'breathData/setSituation', data: {id, situation}});
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

    //新加请求接口

    //身体评估-获取上次身体评估记录用于默认
    static postPhysical(data) {
        return Network.request({url: 'breathData/sync', data: data});
    }

    //个人中心--体重体脂记录-修改
    static postSetBMIInfo(data) {
        return Network.request({url: 'breathData/sync', data: data});
    }

    //吹气完成进入结果页
    static postSetGradeInfo(data) {
        return Network.request({url: 'breathData/info', data: data});
    }

    //分享进入结果页面
    static postshareInfo(data) {
        return Network.request({url: '/breathData/shareInfo', data: data});
    }

    //添加减脂方案目标
    static postSetTarget(data) {
        return Network.request({url: 'breathData/sync', data: data});
    }

    //获取菜谱对应详细信息
    static postCookInfo({Id}) {
        return Network.request({url: 'breathData/sync', data: {Id}});
    }

    //今日身体情况记录--体重&体脂
    static postTodayBMI(data) {
        return Network.request({url: 'breathData/list', data: data})
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
    //首页打卡分享
    static postSharetask(data) {
        return Network.request({url: 'members/share/task',data:data})
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
    //方案完成荣誉报告
    static postPlanFinish({planId,sharedId}) {
        return Network.request({url: 'members/plan/finishInfo',data: {planId,sharedId}})
    }
    //退出方案
    static postMembersExit({planId}) {
        return Network.request({url: 'members/plan/exit',data: {planId}})
    }
  static postMembersJoinSchema({ schemaId, startTime}) {
    return Network.request({ url: 'members/joinSchema', data: { schemaId, startTime}})
    }

    static postSettingsLosefatSchema() {
        return Network.request({url: 'settings/losefatSchema'})
    }

    static postBreathDatalistAll(data) {
        return Network.request({url: 'breathData/listAll', data});
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

    static postWeightDataListAll({timeBegin, timeEnd}) {
        return Network.request({url: 'weightData/listAll', data: arguments[0]});
    }

    static postBloodPressureDataListAll({timeBegin, timeEnd}) {
        return Network.request({url: 'bloodPressureData/listAll', data: arguments[0]});
    }

    static postHeartDataListAll({timeBegin, timeEnd}) {
        return Network.request({url: 'heartData/listAll', data: arguments[0]});
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


    /**
     * 任务分享-分享详情
     * @param {sharedId} param0
     */
    static postTaskSharedInfo({sharedId}){
        return Network.request({url: 'members/share/taskInfo', data:{sharedId}})
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

}
