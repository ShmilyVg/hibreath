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
        duration: {
            type: Array,
            value: []
        },
        inputType: {
            type: String,
            value: 'number'
        },
        maxLength: {
            type: Number,
            value: 3
        },
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
            this.setData({value: this.data.durationIndex});
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
                    value: e
                });
            });

        },
        bindCancel(e) {
            // console.log(e);
        },
        bindMultiPickerColumnChange(e) {
            const {detail: {column, value}} = e, {durationIndex: [firstIndexValue,endIndexValue]} = this.data;
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
