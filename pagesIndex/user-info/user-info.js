import Protocol from "../../modules/network/protocol";
import {chooseImage, entries, uploadFile} from "./manager";
import {Toast} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
import {whenDismissGroup} from "../../pages/community/social-manager";

Page({


    data: {
        endYear: '',
        originUserInfo: {
            nickname: '',
            portraitUrl: '',
            sex: -1,
            height: 0,
            weight: 0,
            birthday: '',
            bodyFatRate: null,
            mealType: []
        },
        editUserInfo: {},
        mealTypeString: '请输入'
    },


    async onLoad(options) {
        const {result: {list: habits}} = await Protocol.postMealType();
        const {result: {nickname, portraitUrl, sex, height, weight, birthday, bodyFatRate, mealType}} = await Protocol.getUserDetailInfo();
        const now = new Date();
        let birthdayStr = "";
        if(birthday){
            birthdayStr = birthday.split('-').map(item => item.padStart(2, '0')).join('-')
        }
        this.setData({
            habits,
            endYear: [now.getFullYear(), now.getMonth() + 1, now.getDate()].map(item => item.toString().padStart(2, '0')).join('-'),
            originUserInfo: {
                nickname,
                portraitUrl,
                sex,
                height,
                weight,
                birthday: birthdayStr,
                bodyFatRate,
                mealType,
            }
        }, () => {
            getApp().globalData.tempValue.foodHabitArray = mealType;
            this.showMealTypeStr({myMealType: mealType});
        });
    },

    onShow() {
        const {foodHabitArray} = getApp().globalData.tempValue;
        console.log('[onShow] foodHabitArray',foodHabitArray);
        if (foodHabitArray && foodHabitArray.length) {
            this.showMealTypeStr({myMealType: foodHabitArray});
            this.setData({
                'editUserInfo.mealType': foodHabitArray,
            });
        }
    },

    showMealTypeStr({myMealType}) {
        if(this.data.habits){
            this.setData({
                mealTypeString: this.data.habits.filter(habit => {
                    for (const item of myMealType) {
                        if (habit.key === item) {
                            return true;
                        }
                    }
                    return false;
                }).map(item => item.name).join(' ') || '请输入',
            });
        }

    },

    async saveUserInfo({detail: {value: values}}) {
        console.log(values);
        const obj = {};
        for (const [key, value] of entries(values)) {
            if (value !== undefined && value !== "" && value !== null) {
                obj[key] = value;
            }
        }
        const finalEditUserInfoObj = {...this.data.editUserInfo, ...obj},
            finalUserInfoObj = {...this.data.originUserInfo, ...finalEditUserInfoObj};

        console.log('finalEditUserInfoObj', finalEditUserInfoObj, 'finalUserInfoObj', finalUserInfoObj);
        if (this.checkFill(finalUserInfoObj)) {
            await whenDismissGroup(Protocol.postMembersPutInfo(finalEditUserInfoObj));
            Toast.success('保存成功');
            HiNavigator.navigateBack({delta: 1});
        } else {
            Toast.showText('请完善所有信息');
        }
    },

    checkFill(finalUserInfoObj) {
        for (const [key, value] of entries(finalUserInfoObj)) {
            if (!value) {
                if (key !== 'sex') {
                    return false;
                } else return value !== null;
            } else {
                if (Array.isArray(value)) {
                    return !!value.length;
                }
            }
        }
    },
    async uploadHeadEvent() {
        const filePath = await chooseImage(), portraitUrl = await uploadFile({filePath});
        this.setData({'editUserInfo.portraitUrl': portraitUrl});
    },

    bindSexPickerChange({detail: {value}}) {
        console.log(value);
        this.setData({'editUserInfo.sex': parseInt(value)});
    },

    bindBirthdayPickerChange({detail: {value}}) {
        console.log(value);
        this.setData({'editUserInfo.birthday': value});
    }

});
