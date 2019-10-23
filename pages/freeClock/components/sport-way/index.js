import Protocol from "../../../../modules/network/protocol";
import {Toast} from "heheda-common-view";

function getDefaultSportWays() {
    return new Array(9).fill(0).map((item, index) => ({id: index + 1}));
}

Component({
    behaviors: ['wx://form-field'],
    options: {
        addGlobalClass: true,
    },
    properties: {
        selectedIds: {
            type: Array,
            value: []
        }

    },
    observers: {
        'selectedIds'(ids) {
            this._updateItemBySelectedId(ids);
        }
    },
    data: {
        sportWays: getDefaultSportWays()
    },
    lifetimes: {
        created() {

        },
        async attached() {
            Toast.showLoading();
            const {result: {list: sportWays}} = await Protocol.postSettingsSportStyle();
            const {selectedIds} = this.data;
            this.setData({sportWays}, () => {
                if (selectedIds && selectedIds.length) {
                    this._updateItemBySelectedId(selectedIds);
                } else {
                    this.setData({
                        value: this._getValue()
                    });
                }
                Toast.hiddenLoading();
            });
        },
    },
    methods: {
        _onSportWayItemClick(e) {
            const {currentTarget: {dataset: {item: clickItem}}} = e;
            this.setData(this._getUpdateObjForSelectedItemById({
                itemId: clickItem.id,
                selected: !clickItem.selected
            }), () => {
                this.setData({value: this._getValue()});
            });
        },

        _updateItemBySelectedId(ids) {
            if (ids.length && this.data.sportWays.length) {
                let obj = {};
                for (let itemId of ids) {
                    Object.assign(obj, this._getUpdateObjForSelectedItemById({itemId, selected: true}));
                }
                console.log(obj);
                this.setData(obj, () => {
                    this.setData({value: this._getValue()});
                });
            }
        },

        _getValue() {
            return this.data.sportWays.filter(item => item.selected)
        },

        _getUpdateObjForSelectedItemById({itemId, selected}) {
            for (let [index, item] of this.data.sportWays.entries()) {
                if (item.id === itemId) {
                    let obj = {};
                    obj[`sportWays[${index}].selected`] = selected;
                    return obj;
                }
            }

        }
    }
});
