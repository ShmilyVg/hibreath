import {Network} from "./network/index";

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
        return Network.request({url: 'breathData/list', data: {page, pageSize}})
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
        return Network.request({url: '/breathData/info', data: data});
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

    static postMembersJoinSchema({schemaId}) {
        return Network.request({url: 'members/joinSchema', data: {schemaId}})
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

}
