import Network from "./network";

export default class Protocol {

    // /**
    //  * 示例
    //  * @param friendId
    //  */
    // static postExample({friendId}) {
    //     return Network.request({url: 'user/friend/example', data: {friendId}});
    // }

    static getMemberInfo() {
        return Network.request({url: 'user/info'});
    }

    static getHistoryList({userId=123}) {
        return Network.request({url: 'user/history', data: {userId}});
    }

    static getAnalysisSituation(){
        return Network.request({url:'analysis/situation'})
    }
}
