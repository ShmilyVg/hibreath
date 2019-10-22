import {oneDigit} from "../../pages/food/manager";

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        color:{
            type:String,
            value: 'white'
        }
    },

    data: {

    },
    lifetimes: {
        created() {
        },
        attached() {

        },
    },
    methods: {
        onSettingClickEvent() {
            this.triggerEvent('onSettingClickEvent', {show: true});
        },
    }
});
