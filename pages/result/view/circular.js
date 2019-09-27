var ctx = wx.createCanvasContext("dashboard"); //创建一个全局的canvas绘图上下文
var bg = wx.createCanvasContext("bg");
var w = "";
var h = "";

let _page = null;

function init(page) {
    _page = page;
}

function run() {
    drewCircular();
    showType();
}

function drewCircular() {
    const circleScore = _page.data.score * 10
    var gradient = ctx.createLinearGradient(0, 0, 125, 0);
    console.log('2', 20 < circleScore <= 40)
    if (circleScore <= 20) {
        gradient.addColorStop("0", "#542EE3");
        gradient.addColorStop("0.2", "#250099");
    } else if (20 < circleScore && circleScore <= 40) {
        gradient.addColorStop("0", "#0026FE");
        gradient.addColorStop("0.4", "#00CFFF");
    } else if (40 < circleScore && circleScore <= 60) {
        gradient.addColorStop("0", "#20D9D1");
        gradient.addColorStop("0.6", "#00B96C");
    } else if (60 < circleScore && circleScore <= 80) {
        gradient.addColorStop("0", "#FFE300");
        gradient.addColorStop("0.8", "#FF9F00");
    } else {
        gradient.addColorStop("0", "#FF8F00");
        gradient.addColorStop("1", "#EF2511");
    }

    const drawCircle = (target, start, end, color) => {
        //arc 圆心的X坐标  Y坐标  半径  起始弧度  终止弧度 是否逆时针
        target.arc(100, 100, 90, start * Math.PI / 180, end * Math.PI / 180);
        target.setStrokeStyle(color);
        target.setLineWidth("5");
        //计算公式 （2ΠR*3/4-40）/5
        target.setLineDash([76.823, 10], 0);
        target.setLineCap("round");
        target.stroke();
        // target.draw();
    }

    var parts = [
        {
            r: [0, 100],
            s: -225,
            e: 45
        }
    ];

    var fillGrid = (target, grid, color, val) => {
        for (let i in grid) {
            let p = grid[i];
            if (val >= p.r[0]) {
                drawCircle(target, p.s, p.e, color);
            }
        }
    }

    var deal = val => {
        var result = [];
        result.push(
            {
                r: [0, val],
                s: -225,
                e: val * 54 / 20 - 225
            }
        )
        return result;
    }

    var setPercent2 = val => {
        ctx.clearRect(0, 0, 250, 250);
        var pt = deal(val);

        fillGrid(ctx, pt, gradient, val);
        ctx.setFontSize(23);
        ctx.setFillStyle("#292930");
        var offset = 140;
        ctx.fillText(val / 10, offset, 105);
        /* ctx.setFontSize(15);
         ctx.setFillStyle("#969696");
         ctx.fillText(10, offset, 105);*/
        /*  if (circleScore <= 20) {
              ctx.fillText("继续努力", 70, 165);
          } else if (20 < circleScore && circleScore <= 40) {
              ctx.fillText("缓慢燃脂", 70, 165);
          } else if (40 < circleScore && circleScore <= 60) {
              ctx.fillText("状态极佳", 70, 165);
          } else if (60 < circleScore && circleScore <= 80) {
              ctx.fillText("快速燃脂", 70, 165);
          } else {
              ctx.fillText("过度燃脂", 70, 165);
          }
          ctx.setFontSize(12);
          ctx.setFillStyle("#969696");
          if (circleScore <= 20) {
              ctx.fillText("KEEP ON", 70, 185);
          } else if (20 < circleScore && circleScore <= 40) {
              ctx.fillText("SLOW", 70, 185);
          } else if (40 < circleScore && circleScore <= 60) {
              ctx.fillText("PROPER", 70, 185);
          } else if (60 < circleScore && circleScore <= 80) {
              ctx.fillText("FAST", 70, 185);
          } else {
              ctx.fillText("UNDUE", 70, 185);
          }*/
        ctx.draw();
    }

    fillGrid(bg, parts, '#DCDCDC', 100);
    bg.draw();

    var percent = 0;
    var lastFrameTime = 0;
    // 模拟 requestAnimationFrame
    var doAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastFrameTime));
        var id = setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastFrameTime = currTime + timeToCall;
        return id;
    };
    // 模拟 cancelAnimationFrame
    var abortAnimationFrame = function (id) {
        clearTimeout(id)
    }
    var animation = v => {
        var transform = val => {
            percent += percent > v ? -1 : 1;
            let ani = doAnimationFrame(() => {
                transform(v);
            })
            setPercent2(percent);
            if (percent === v) {
                abortAnimationFrame(ani);
                return;
            }
        }
        transform(v)
    }
    animation(_page.data.score * 10);
    /* setInterval(() => {
       //var round = Math.round(100 * Math.random());
        var round =60;
       animation(round);
     }, 2500);*/
}

function showType() {
    if (_page.data.score <= 1) {
        _page.setData({
            fatType: "../../images/result/type1.png",
            fatText: "未燃脂",
            fatTextEn: "CHIN UP",
            fatDes: ''
        })
    } else if (_page.data.score <= 2 && _page.data.score > 1) {
        _page.setData({
            fatType: "../../images/result/type2.png",
            fatText: "缓慢燃脂",
            fatTextEn: "SLOW",
            fatDes: '“ 相当于减掉了1-9g脂肪 ”'
        })
    } else if (_page.data.score <= 4 && _page.data.score > 2) {
        _page.setData({
            fatType: "../../images/result/type3.png",
            fatText: "状态极佳",
            fatTextEn: "PROPER",
            fatDes: '“ 相当于减掉了9-17g脂肪 ”'
        })
    } else if (_page.data.score <= 6 && _page.data.score > 4) {
        _page.setData({
            fatType: "../../images/result/type4.png",
            fatText: "快速燃脂",
            fatTextEn: "FAST",
            fatDes: '“ 相当于减掉了17-51g脂肪 ”'
        })
    } else if (_page.data.score <= 10 && _page.data.score > 6) {
        _page.setData({
            fatType: "../../images/result/type5.png",
            fatText: "过度燃脂",
            fatTextEn: "UNDUE",
            fatDes: ''
        })
    }
}

function createSelectorQuery() {
    wx.createSelectorQuery().select('#canvas-one').boundingClientRect(function (rect) {
        //监听canvas的宽高
        console.log(rect);
        if (rect == null) {
            return
        }
        w = parseInt(rect.width / 2);
        // 获取canvas宽的的一半
        h = parseInt(rect.height / 2);
        //获取canvas高的一半，
        //获取宽高的一半是为了便于找到中心点
        console.log(w, "w")
        console.log(h, "h")
        //arc 圆心的X坐标  Y坐标  半径  起始弧度  终止弧度 是否逆时针
    }).exec()
}

module.exports = {
    init, run, createSelectorQuery
};
