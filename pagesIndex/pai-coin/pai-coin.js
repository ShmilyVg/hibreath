import Protocol from "../../modules/network/protocol";
import {Toast} from "heheda-common-view";

Page({

    data: {
        taskPageIndex: 0,
        integral: "10000",//积分数量
        tasks: []
    },

    async onLoad(options) {
        const rikey = [{//新手任务
            "title": "减脂方案",
            "subTitle": "首次加入",
            "executeIndex": 0,//已经执行了几次
            "totalIndex": 10,//共几次
            "finished": true,//是否完成
            "receive": true,//是否领取
            "integral": 10,//奖励金币数量
            "id": 10,//任务id
        }, {//新手任务
            "title": "减脂方案",
            "subTitle": "首次加入",
            "executeIndex": 0,//已经执行了几次
            "totalIndex": 10,//共几次
            "finished": true,//是否完成
            "receive": false,//是否领取
            "integral": 10,//奖励金币数量
            "id": 11,//任务id
        }, {//新手任务
            "title": "减脂方案",
            "subTitle": "首次加入",
            "executeIndex": 0,//已经执行了几次
            "totalIndex": 10,//共几次
            "finished": true,//是否完成
            "receive": true,//是否领取
            "integral": 10,//奖励金币数量
            "id": 12,//任务id
        }, {//新手任务
            "title": "减脂方案",
            "subTitle": "首次加入",
            "executeIndex": 0,//已经执行了几次
            "totalIndex": 10,//共几次
            "finished": true,//是否完成
            "receive": true,//是否领取
            "integral": 10,//奖励金币数量
            "id": 13,//任务id
        }];


        this.setData({
            taskPageIndex: 0,
            tasks: rikey
        });

        this.switchTasksShowEvent({currentTarget: {dataset: {index: 0}}});
    },

    toFinishedEvent({currentTarget: {dataset: {id}}}) {

    },
    toReceiveEvent({currentTarget: {dataset: {id}}}) {

    },
    async switchTasksShowEvent({currentTarget: {dataset: {index}}}) {
        const clickIndex = parseInt(index);
        if (clickIndex !== this.data.taskPageIndex) {
            try {
                Toast.showLoading();
                // const {result: {integral, list}} = await this.getIntegralProtocol({taskPageIndex: clickIndex});
                this.setData({
                    taskPageIndex: clickIndex,
                    // integral,
                    // tasks: list
                });
            } catch (e) {
                console.error(e);
            } finally {
                Toast.hiddenLoading();
            }

        }
    },

    getIntegralProtocol({taskPageIndex}) {
        return taskPageIndex === 0 ? Protocol.postIntegralSingle() : Protocol.postIntegralDaily();
    }
});
