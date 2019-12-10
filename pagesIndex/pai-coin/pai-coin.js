import Protocol from "../../modules/network/protocol";
import {Toast} from "heheda-common-view";

Page({

    data: {
        taskPageIndex: -1,
        integral: 0,//积分数量
        integralStr: "0",
        tasks: []
    },

    async onLoad(options) {
        this.switchTasksShowEvent({currentTarget: {dataset: {index: 0}}});
    },

    toFinishedEvent({currentTarget: {dataset: {id}}}) {
        console.log('点击去完成 id:', id);
    },
    async toReceiveEvent({currentTarget: {dataset: {id}}}) {
        console.log('点击领取 id:', id);
        await Protocol.postIntegralReceive({id});
        const {tasks, integral} = this.data;
        for (const [index, item] of tasks.entries()) {
            if (item.id === id) {
                const obj = {integralStr: this.createIntegralStr((integral + parseInt(item.integral)).toString())};
                obj[`tasks[${index}].receive`] = true;
                this.setData(obj);
                break;
            }
        }
    },
    async switchTasksShowEvent({currentTarget: {dataset: {index}}}) {
        const clickIndex = parseInt(index);
        if (clickIndex !== this.data.taskPageIndex) {
            try {
                Toast.showLoading();
                const {result: {integral, list}} = await this.getIntegralProtocol({taskPageIndex: clickIndex}),
                    tasks = [], headArray = [];
                for (let item of list) {
                    if (item.receive) {
                        tasks.push(item);
                    } else if (item.finished) {
                        headArray.push(item);
                    } else {
                        tasks.unshift(item);
                    }
                }
                this.setData({
                    taskPageIndex: clickIndex,
                    integral,
                    integralStr: this.createIntegralStr(integral ? integral.toString() : '0'),
                    tasks: headArray.concat(tasks)

                });
            } catch (e) {
                console.error(e);
            } finally {
                Toast.hiddenLoading();
            }

        }
    },


    createIntegralStr(integral) {
        return integral.length > 3 ? integral.slice(0, -3) + ',' + integral.slice(-3) : integral;
    },

    getIntegralProtocol({taskPageIndex}) {
        return taskPageIndex === 0 ? Protocol.postIntegralSingle() : Protocol.postIntegralDaily();
    },
});
