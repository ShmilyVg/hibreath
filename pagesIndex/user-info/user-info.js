import Protocol from "../../modules/network/protocol";

Page({


    data: {},


    async onLoad(options) {
        const {result: {nickname, portraitUrl, sex, height, weight, birthday, bodyFatRate, mealType}} = await Protocol.getUserDetailInfo();

    },

    async saveUserInfo(e) {
        console.log(e);
        // await Protocol.postMembersPut({birthday, height, weight, weightGoal, bodyFatRate, mealType, goalDesc});
    },
    bindSexPickerChanged({detail: {value}}) {
        console.log(value);
    }
});
