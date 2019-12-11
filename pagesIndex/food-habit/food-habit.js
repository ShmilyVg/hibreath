import Protocol from "../../modules/network/protocol";
import {Toast} from "heheda-common-view";

Page({
    data: {
        habits: []
    },

    async onLoad(options) {
        const {result: {list: habits}} = await Protocol.postMealType();
        this.setData({habits});
    },

    onSelectedFoodHabitItemEvent({currentTarget: {dataset: {id: key}}}) {
        const {habits} = this.data;
        if (key === 'none') {
            habits.forEach(item => item.selected = item.key === 'none');
            this.setData({habits});
        } else {
            for (const [index, item] of habits.entries()) {
                if (item.key === key) {
                    const objKey = `habits[${index}].selected`,
                        noneItemIndex = habits.findIndex(item => item.key === 'none'),
                        noneObjKey = `habits[${noneItemIndex}].selected`;
                    this.setData({
                        [objKey]: !item.selected,
                        [noneObjKey]: false
                    });
                    break;
                }
            }
        }


    },
    saveFoodHabitEvent() {
        const {habits} = this.data, selectedItems = habits.filter(item => item.selected).map(item => item.key);
        if (selectedItems.length) {
            getApp().globalData.tempValue.foodHabitArray = selectedItems;
        } else {
            Toast.showText('请至少选择一项');
        }
    }
});
