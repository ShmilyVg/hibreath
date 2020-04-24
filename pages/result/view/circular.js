/**
 * @Date: 2019-10-08 17:42:53
 * @LastEditors: 张浩玉
 */
var ctx = wx.createCanvasContext("dashboard"); //创建一个全局的canvas绘图上下文
var bg = wx.createCanvasContext("bg");
var w = "";
var h = "";

let _page = null;
let _xWidth = 0;

function init(page) {
  console.log('dWidth', page)
  _page = page;
  const dWidth = wx.getSystemInfoSync().windowWidth;
  _xWidth = dWidth / 375
}

function run() {
  drewCircular();
  showType();
}

function drewCircular() {
  console.log("_page.data.score", _page.data.score)
  const circleScore = _page.data.score
  var gradient = ctx.createLinearGradient(0, 0, 125, 0);
  if (circleScore <= 2) {
    gradient.addColorStop("0", "#542EE3");
    gradient.addColorStop("0.2", "#250099");
  } else if (3 <= circleScore && circleScore <= 9) {
    gradient.addColorStop("0", "#0026FE");
    gradient.addColorStop("0.4", "#00CFFF");
  } else if (10 <= circleScore && circleScore <= 19) {
    gradient.addColorStop("0", "#20D9D1");
    gradient.addColorStop("0.6", "#00B96C");
  } else if (20 <= circleScore && circleScore <= 39) {
    gradient.addColorStop("0", "#FFE300");
    gradient.addColorStop("0.8", "#FF9F00");
  } else {
    gradient.addColorStop("0", "#FF8F00");
    gradient.addColorStop("1", "#EF2511");
  }

  const drawCircle = (target, start, end, color) => {
    //arc 圆心的X坐标  Y坐标  半径  起始弧度  终止弧度 是否逆时针
    target.arc(100 * _xWidth, 100 * _xWidth, 90 * _xWidth, start * Math.PI / 180, end * Math.PI / 180);
    target.setStrokeStyle(color);
    target.setLineWidth("5");
    //计算公式 （2ΠR*3/4-40）/5
    target.setLineDash([76.823 * _xWidth, 10 * _xWidth], 0);
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
    let k = val <= 2 ? 1:val <= 9?2:val <= 19?3:val <=39?4:5;
    let s = -224
    result.push(
      {
        r: [0, val],
        s: s,
        // e: val * 54 / 20 - 225
        e:54 * k+s
      }
    )
    return result;
  }

  var setPercent2 = val => {
    ctx.clearRect(0, 0, 250, 250);
    var pt = deal(val);
    fillGrid(ctx, pt, gradient, val);
    ctx.setFontSize(75);
    ctx.setFillStyle("#292930");
    var offset = val > 9 ? 55  : 75 ;
    ctx.fillText(val, offset * _xWidth, 115 * _xWidth);
    ctx.setFontSize(10);
    ctx.fillText('ppm', 75 * _xWidth + 15, 115 * _xWidth + 20);
    ctx.drawImage('../../images/ask_green.png', 75 * _xWidth + 40,  115 * _xWidth + 12, 10, 10)
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
      percent += percent > v ? -1 : 10;
      let ani = doAnimationFrame(() => {
        transform(v);
      })
      setPercent2(percent / 10);
      if (percent === v) {
        abortAnimationFrame(ani);
        return;
      }
    }
    transform(v)
    console.log('vvvvvvv', percent)
  }
  animation(_page.data.score * 10);
}

function showType() {
  if (_page.data.score <= 2) {
    _page.setData({
      fatType: "../../images/result/type1.png",
      fatText: "未燃脂",
      fatTextEn: "UNBURNED",
    })
  } else if (_page.data.score <= 9 && _page.data.score >= 3) {
    _page.setData({
      fatType: "../../images/result/type2.png",
      fatText: "稳步燃脂",
      fatTextEn: "GOOD",
    })
  } else if (_page.data.score <= 19 && _page.data.score >= 10) {
    _page.setData({
      fatType: "../../images/result/type3.png",
      fatText: "状态极佳",
      fatTextEn: "PERFECT",
    })
  } else if (_page.data.score <= 39 && _page.data.score >= 20) {
    _page.setData({
      fatType: "../../images/result/type4.png",
      fatText: "快速燃脂",
      fatTextEn: "EXCESSIVE",
    })
  } else if (_page.data.score <= 99 && _page.data.score >= 40) {
    _page.setData({
      fatType: "../../images/result/type5.png",
      fatText: "过度燃脂",
      fatTextEn: "RISKY",
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
