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
        isAndroid: platform === 'android'
    },
    lifetimes: {
        created() {
            console.log(this.data);
            const {durationArray, durationIndex} = this.data;

            console.log(durationArray[0][durationIndex[0]].content);
            // const {platform} = wx.getSystemInfoSync();
            // this.data.isAndroid = platform === 'android';
        },
        attached() {
        },
    },
    methods: {

    }
});
