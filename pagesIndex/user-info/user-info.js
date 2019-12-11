import Protocol from "../../modules/network/protocol";
import {UploadUrl} from "../../utils/config";

Page({


    data: {},


    async onLoad(options) {
        const {result: {nickname, portraitUrl, sex, height, weight, birthday, bodyFatRate, mealType}} = await Protocol.getUserDetailInfo();

    },
    async saveUserInfo(e) {
        console.log(e);
        // await Protocol.postMembersPut({birthday, height, weight, weightGoal, bodyFatRate, mealType, goalDesc});
    },
    async uploadHeadEvent() {
        const filePath = await this.chooseImage(), portraitUrl = await this.uploadFile({filePath});
        this.setData({portraitUrl});
    },
    bindSexPickerChanged({detail: {value}}) {
        console.log(value);
    },
    uploadFile({filePath}) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: UploadUrl, filePath, name: filePath, success: res => {
                    const data = JSON.parse(res.data);
                    if (data && data.result && data.result.path) {
                        const imageUrl = data.result.path;
                        resolve(imageUrl);
                    } else {
                        reject();
                    }
                }, fail: reject
            });
        });
    },
    chooseImage() {
        return new Promise((resolve, reject) => {
            wx.chooseImage({
                count: 1, sizeType: ['compressed'], success: res => {
                    const {tempFiles} = res;
                    if (tempFiles.length) {
                        resolve(tempFiles[0].path);
                    } else {
                        reject();
                    }
                }, fail: reject
            })
        })
    }
});
