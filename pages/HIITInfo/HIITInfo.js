import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
        videoUrl:"",
        confirmText: '好哒',
        cancelText: '取消',
        tintColor: 'color:#00a48f',
        title:"真棒！",
        content:"恭喜完成本次运动",
        hidden:true,
        itemNumber:2,
        isAutoplay:true,
        isLive:0,//正在播放的视频下标
        sliderValue: 0, //控制进度条slider的值，
        updateState: false, //防止视频播放过程中导致的拖拽失效
        progressM:"",
        videoLast:false
    },
    onReady: function (res) {
        this.videoContext = wx.createVideoContext('videoplayer');
        this.setData({
            updateState: true
        })
    },

    onLoad: function (data) {
    console.log("123123",data)

    },
    onShow:function () {
        let list=[{"videoUrl": "https://apd-0c583ae3dc3943d674add80d35f80a63.v.smtcdns.com/vhot2.qqvideo.tc.qq.com/A3JNIJlawJ1S21j7a35VF_jiYLJG-VaEgaoXeM3bobAs/uwMROfz2r5zIIaQXGdGnC2dfDmb_xYKxrIGz_bGUg2Lja6ru/m0910jndeqr.mp4?sdtfrom=v1104&guid=0ba6e86bbdb1436dc6a42f69deeb19ea&vkey=DCFFE47C563EDBE85595BB2286CCB69741EF9144A2EE3430D0E0C1448C8EC01DF64E1B81982498E7738CD59D11E79171738A9B7DB40E85DE5A58AEFA7E89E5E055FDA0002AB30E949321E0B08306C201FF0560394062E17E069D5CD634D41D170594B0FFC1E0081830A1F4EE562A782C4A6AD5B4AE0D5FF95854CA43469BC877",
            "title": "第二个",
            "des": "第二个描述",
            "pic": "../../images/hiIi2.png"
        },
            {"videoUrl": "https://apd-1bfcd8a10b978e29b6748aefdbed8bb9.v.smtcdns.com/vhot2.qqvideo.tc.qq.com/AfOAf658R6NL2YwpvPouwChpI76TDXedVd_cS2ZEgcJA/uwMROfz2r5zIIaQXGdGnC2dfJ6mILpu3w5FdmdznudzRKvsH/u0910yy99tz.p701.1.mp4?sdtfrom=v1104&guid=0ba6e86bbdb1436dc6a42f69deeb19ea&vkey=37E241FBE737734A625828EA74F18525D0D8C69B78386E12F737398B8D61076479F4928CFDF0BF60CF04553CCE71C2465899592CBB15523D51FE52A109806E0F38F232C236F4CC19D87B5F8858CA519A311B60260CA8E4668D0AD5839E39ACA3B59D71D78DC1E72DB7FB48812489D279C2B9DBB47F0789D1037EE48F602F82E3",
                "title": "第一个",
                "des": "第一个描述",
                "pic": "../../images/hiit1.png"
            },{"videoUrl": "https://ugcws.video.gtimg.com/uwMROfz2r5zIIaQXGdGnC2dfJ6mILpu3w5FdmdznudzRKvsH/e0910zxv1ix.p701.1.mp4?sdtfrom=v1104&guid=0ba6e86bbdb1436dc6a42f69deeb19ea&vkey=F145191947287D8277E55730A761D9E8854B1FA315DC163DC5F0470965C0E8D3362BCBC5BD238DD07A5DB058E005823224BD2185008CE2B5478D2F43E98B6BB925C4822A45C1CB398BE90266CD005BD7753EBDC6CBAA63C2B721E8DFF4FD5B71CDF977AD67356EA3226620E9623C24676CBF41A707D392AC43839CB2DE6B76C0",
                "title": "第三个",
                "des": "第二个描述",
                "pic": "../../images/hiIi2.png"
            },{"videoUrl": "https://apd-106df6787b700e5b544dd9c566049ab5.v.smtcdns.com/vhot2.qqvideo.tc.qq.com/AEr_Lkfk8l57jYN2CZPVAkdiRjHP7kqsWs_lptyj4zHA/uwMROfz2r5zIIaQXGdGnC2dfJ6mILpu3w5FdmdznudzRKvsH/i0910e17iur.p701.1.mp4?sdtfrom=v1104&guid=0ba6e86bbdb1436dc6a42f69deeb19ea&vkey=930DBF2936466010DD54A2C44B4FA5466C057A9C3A4A32D5C9EA85A16285B57B054A76A9A60785B4DAF29ED10A41278DCF07D25A962012944830B90C9AB9D059DBCD028A026E09F1EAE0F46EE9E48C6F7426A8353BAFA91D2AC6E0D4BB7D3B53F0D4C3050354AF25096FCBBBB82DC7C672FFB98F5C6DD8DC377FBDAA5357FA4F",
                "title": "第四个",
                "des": "第二个描述",
                "pic": "../../images/hiIi2.png"
            },{"videoUrl": "https://apd-106df6787b700e5b544dd9c566049ab5.v.smtcdns.com/vhot2.qqvideo.tc.qq.com/A96TmRYNnu0OtgzLz3_dIz6DDqy3qf-Q4U2PwXPNIvSc/uwMROfz2r5zEIaQXGdGnC2dfJ6norVr71SyOzMWdO4L-7R5f/a0910x5ez8y.p701.1.mp4?sdtfrom=v1104&guid=0ba6e86bbdb1436dc6a42f69deeb19ea&vkey=9C79B59FC14266C4CECECC135719A0ABC3B3ACA54581E649FD96A6DC893C1892B910E7EAC33EEBD128CA0B9D82DE5B1E8A1E47AE5682288DDD8BA95438F463A4E528509EF479EAA8B0D6781A3D74BB447E2D5C9CA70A714A76CBDB92D6955979E6C8BC35BB0C4EA26D3A5CA609885C4990ABA26EE2794C75C442DB4296825C68",
                "title": "第五个",
                "des": "第二个描述",
                "pic": "../../images/hiIi2.png"
            },{"videoUrl": "https://apd-1023b7028d97989079e20ea0d9cce1b3.v.smtcdns.com/vhot2.qqvideo.tc.qq.com/Ah77OIZIacod-HI2i53iPFtfMc6NMBzt11r5KhwFRGrk/uwMROfz2r5zIIaQXGdGnC2dfJ6mILpu3w5FdmdznudzRKvsH/a0910r5qp9j.p701.1.mp4?sdtfrom=v1104&guid=0ba6e86bbdb1436dc6a42f69deeb19ea&vkey=B5FA04ECDA495DCC5FFAA6DC48E54B779CF71312A84618577F857FD6B98CCAA68BD4CE2D3EB4D72C8CEE9297A9B3E21324FA0B340939BEA607B4A031CBF559ED11971A8EAEB376E4D0A6EAFD4F36CC2E6012C18B91049157C7B60A0583EDE5B3B4E97F4DAD3A9AB6288A66BDB5C41C0653A449A1648E3CA1C832EFC5A480E8F9",
                "title": "第六个",
                "des": "第二个描述",
                "pic": "../../images/hiIi2.png"
            },{"videoUrl": "https://ugcbsy.qq.com/uwMROfz2r5zIIaQXGdGnC2dfJ6mILpu3w5FdmdznudzRKvsH/j09106ho831.p701.1.mp4?sdtfrom=v1104&guid=0ba6e86bbdb1436dc6a42f69deeb19ea&vkey=2130032A1BB25B4911E06C14BCC94C3EDDF5411BF00AA68FD79AAFF505C2A370F81601784904986D6BD090E03EA2F657C8A12CEEFF19E8BEAB0238541E569154DBF6038BFBDFC56D935492FAD00D5F85147C52261EF76A756B9E1E7F133323A38F2B4C12682596A598E56362C3C66395900AB1280B9E667F5B243B55E75F5BD8",
                "title": "第七个",
                "des": "第二个描述",
                "pic": "../../images/hiIi2.png"
            },{"videoUrl": "https://ugcws.video.gtimg.com/uwMROfz2r5zIIaQXGdGnC2dfJ6mILpu3w5FdmdznudzRKvsH/w0910q1f4fa.p701.1.mp4?sdtfrom=v1104&guid=0ba6e86bbdb1436dc6a42f69deeb19ea&vkey=5C3844ED1B557C257FEBDE4E91F89302DC8D577EE05264C5BEDA6ABF52B7BC76D76336E465EE40291A4C8AA750A4685F421DA368FF52957450DDE7D28F8C160F5CE170850857AEFB9FB8F3F95001FE982D1D1C76D5E5A2EA9538620A009E0010827C0802EFC2592B575A2A55C106B6BF77F4E7152E7FB8DFC19AD61BDF096075",
                "title": "第八个",
                "des": "第二个描述",
                "pic": "../../images/hiIi2.png"
            },{"videoUrl": "https://apd-0c583ae3dc3943d674add80d35f80a63.v.smtcdns.com/vhot2.qqvideo.tc.qq.com/AXkRDrrGBrHcTsFUhq82ubYVIIXPHaxJXSmFTDqW8GTI/uwMROfz2r5zIIaQXGdGnC2dfJ6mILpu3w5FdmdznudzRKvsH/f0910n0dm0a.p701.1.mp4?sdtfrom=v1104&guid=0ba6e86bbdb1436dc6a42f69deeb19ea&vkey=AC247DDEE193A9C358115E2B7121F170B76DA61BDC8E11DF0FB617F4BA2DB125D5C0CF826999DA86AF170E1862B509EB1B2002AEEBDE25DA73E0A59E0A2CD701E87D5E40597211FC050FF8CA8170CDF8E40F3DE5E0D3C75090397A11A44D398CE73A3BAF2E9B15FB301B127AE89AFDF5C0285D549F5D326AF6245A35B4FF008E",
                "title": "第八个",
                "des": "第二个描述",
                "pic": "../../images/hiIi2.png"
            }];
        this.setData({
            list: list,
            videoUrl:list[0].videoUrl
        })
        Protocol.postHIIT().then(data => {

        })
    },
    //播放条时间改表触发
    videoUpdate(e) {
        if (this.data.updateState) { //判断拖拽完成后才触发更新，避免拖拽失效
            let sliderValue = e.detail.currentTime / e.detail.duration * 100;

            this.setData({
                sliderValue: sliderValue,
                progressM: sliderValue,
                duration: e.detail.duration
            })
        }
    },
    sliderChanging(e) {
        this.setData({
            updateState: false //拖拽过程中，不允许更新进度条
        })
    },
    //拖动进度条触发事件
    sliderChange(e) {

        if (this.data.duration) {
            this.videoContext.seek(e.detail.value / 100 * this.data.duration); //完成拖动后，计算对应时间并跳转到指定位置
            this.setData({
                sliderValue: e.detail.value,
                updateState: true //完成拖动后允许更新滚动条
            })
        }
    },

    //视频播放完成后处理   视频自动连续播放&&ALL后弹窗 显示运动完成弹窗
    bindended(){
       this.nextVideo()
    },

    cancel: function () {

    },

    confirm: function () {
        this.setData({
            hidden: true
        })
    },

    lastVideo(){
        for(var i=0;i<this.data.list.length;i++){
            if(this.data.videoUrl == this.data.list[i].videoUrl){
                let vingLaxt= i-1;
                console.log(vingLaxt,'vingLaxt')
                if(vingLaxt<0){
                    this.setData({
                        videoLast: false
                    })
                }else if(vingLaxt ==0){
                    this.setData({
                        videoLast: false,
                        videoUrl: this.data.list[vingLaxt].videoUrl
                    })
                }else{
                    this.setData({
                        videoUrl: this.data.list[vingLaxt].videoUrl
                    })
                }
                return;
            }
        }
    },
    nextVideo(){
        for(var i=0;i<this.data.list.length;i++){
            if(this.data.videoUrl == this.data.list[i].videoUrl){
                let vingNext= i+1;
                if(vingNext>=this.data.list.length){
                    this.setData({
                        hidden: false,
                        videoLast: true
                    })
                }else{
                    this.setData({
                        videoUrl: this.data.list[vingNext].videoUrl,
                        videoLast: true
                    })
                }
                return;
            }
        }
    },
    startVideo(){
        this.videoContext.play();
    },
    stopVideo(){
        this.videoContext.pause();
    },

    videoList(){

    }


})
