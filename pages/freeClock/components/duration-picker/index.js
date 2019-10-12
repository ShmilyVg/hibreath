function getHoursObj() {
    return new Array(100).fill(0)
        .map((item, index) => ({content: ('00' + index).slice(-2), value: index}));
}

function getMinuteObj() {
    return new Array(60).fill(0)
        .map((item, index) => ({content: ('00' + index).slice(-2), value: index}));
}

const {platform} = wx.getSystemInfoSync();
Component({
    behaviors: ['wx://form-field'],
    options: {
        addGlobalClass: true,
    },
    properties: {
        minutes: {
            type: Number,
            value: 20
        },
    },
    observers: {
        'minutes'(value) {
            const hour = Math.floor(value / 60);
            const minute = value % 60;
            this.setData({durationIndex: [hour, minute]},()=>{
                this.setData({
                    value: this._getValue()
                });
            });
        }
    },
    data: {
        durationArray: [getHoursObj(), getMinuteObj()],
        durationIndex: [0, 20],
        isAndroid: platform === 'android',
        tempDurationFirstIndexValue: 0
    },
    lifetimes: {
        created() {
        },
        attached() {
            this.setData({value: this._getValue()});
        },
    },
    methods: {
        bindMultiPickerChange(e) {
            console.log(e);
            const {detail: {value}} = e;
            this.setData({
                durationIndex: value
            }, () => {
                this.setData({
                    value: this._getValue()
                });
            });

        },
        _getValue() {
            const {durationArray: [hours, minutes], durationIndex: [firstIndex, lastIndex]} = this.data;
            return hours[firstIndex].value * 60 + minutes[lastIndex].value;
        },
        bindCancel(e) {
            // console.log(e);
        },
        bindMultiPickerColumnChange(e) {
            const {detail: {column, value}} = e, {durationIndex: [firstIndexValue, endIndexValue]} = this.data;
            this.data.durationIndex[column] = value;
            if (column === 0) {
                if (endIndexValue < 20) {
                    this.setData({'durationIndex[1]': 20});
                }
            } else {
                if (firstIndexValue === 0) {
                    if (value < 20) {
                        this.setData({'durationIndex[1]': 20});
                    }
                }
            }

        },

    }
});
