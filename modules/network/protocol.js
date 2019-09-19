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
    static getBreathDataList({page, pageSize = 15}) {
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

    //获取PPM 脂肪燃烧速度对应等级 步行-骑行-汽车等
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

    //获取减脂方案目标
    static getTargetNmuber(data) {
        return Network.request({url: 'breathData/sync', data: data});
    }

    //HIIT视频
    static postHIIT(data) {
        return Network.request({url: 'breathData/list', data: data})
    }

    // 减脂目标
    static postSettingsGoals() {
        return Network.request({url: 'settings/goals'})
    }

    static postMembersPut(data) {
        return Network.request({url: 'members/put', data})
    }
}
