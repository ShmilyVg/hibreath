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
}
