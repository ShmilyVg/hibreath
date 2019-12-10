import Protocol from "../../modules/network/protocol";
import {Toast} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";

Page({

    data: {
        taskPageIndex: -1,
        integral: 0,//积分数量
        integralStr: "0",
        tasks: [],
        receiveIntegral: '0'
    },

    async onLoad(options) {
        this.switchTasksShowEvent({currentTarget: {dataset: {index: 0}}});
    },

    toFinishedEvent({currentTarget: {dataset: {id, type}}}) {
        console.log('点击去完成 id:', id, 'type:', type);
        switch (type) {
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 8:
            case 11:
                HiNavigator.switchToSetInfo();
                break;
            case 9:
            case 10:
            case 12:
                HiNavigator.switchToCommunity();
                break;
            default:
                break;

        }
    },
    toastTimeoutIndex: -1,
    async toReceiveEvent({currentTarget: {dataset: {id}}}) {
        console.log('点击领取 id:', id);
        await Protocol.postIntegralReceive({id});
        const {tasks, integral} = this.data;
        for (const [index, item] of tasks.entries()) {
            if (item.id === id) {
                const obj = {
                    integralStr: this.createIntegralStr((integral + parseInt(item.integral)).toString()),
                    receiveIntegral: item.integral,
                    showToast: true
                };
                obj[`tasks[${index}].receive`] = true;
                this.setData(obj, () => {
                    clearTimeout(this.toastTimeoutIndex);
                    this.toastTimeoutIndex = setTimeout(() => {
                        this.setData({
                            showToast: false
                        });
                    }, 2000);
                });
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
