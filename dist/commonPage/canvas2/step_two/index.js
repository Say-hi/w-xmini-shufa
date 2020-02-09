'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
// 创建页面实例对象
var app = getApp();
var maxSize = app.data.system.windowWidth - 40; // left & right give gap 20
var chooseArea = {};
var x = null;
var y = null;
var start = null;
var moveYT = null;
var moveXT = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    cjIndex: 2,
    cjArr: [{
      t: '1:1',
      w: 750,
      h: 750
    }, {
      t: '3:4',
      w: 540,
      h: 720
    }, {
      t: '原始比例',
      w: 0,
      h: 0
    }, {
      t: '3:2',
      w: 750,
      h: 500
    }, {
      t: '16:9',
      w: 750,
      h: 422
    }],
    bottomOpD: 'cj',
    single: 'single',
    options: null
  },
  setcj: function setcj(e) {
    this.setData({
      cjIndex: e.currentTarget.dataset.index
    });
    if (e.currentTarget.dataset.index * 1 === 2) {
      return this.getImageInfo(this.data.img.path);
    }
    var cutOx = (maxSize + 40) / 2;
    var cutOy = this.data.img.cutY + this.data.img.cutH / 2;
    var cutcW = this.data.cjArr[this.data.cjIndex].w / 750 * maxSize;
    var cutcH = this.data.cjArr[this.data.cjIndex].h / 750 * maxSize;
    this.setData({
      'img.cutW': cutcW,
      'img.cutH': cutcH,
      'img.cutX': Math.abs(cutOx - cutcW / 2),
      'img.cutY': cutOy - cutcH / 2 > 0 ? cutOy - cutcH / 2 : 0
    });
  },
  chooseAreaStart: function chooseAreaStart(e) {
    this.setData({
      cutAreaMove: true
    });
    chooseArea.x = e.touches[0].pageX;
    chooseArea.y = e.touches[0].pageY;
    chooseArea.xx = this.data.img.cutX;
    chooseArea.yy = this.data.img.cutY;
    chooseArea.w = this.data.img.cutW;
    chooseArea.h = this.data.img.cutH;
    // x = e.touches[0].pageX
    // y = e.touches[0].pageY
    // moveYT = this.data.img.y
    // moveXT = this.data.img.x
  },
  chooseAreaMove: function chooseAreaMove(e) {
    if (e.currentTarget.dataset.type === 'img') {
      var _setData;

      this.setData((_setData = {}, _defineProperty(_setData, 'img.cutX', chooseArea.xx + (e.touches[0].pageX - chooseArea.x)), _defineProperty(_setData, 'img.cutY', chooseArea.yy + (e.touches[0].pageY - chooseArea.y)), _setData));
      // this.setData({
      //   [`img.x`]: moveXT + (e.touches[0].pageX - x),
      //   [`img.y`]: moveYT + (e.touches[0].pageY - y)
      // })
    } else if (e.currentTarget.dataset.type === 'point') {
      var width = chooseArea.w + (e.touches[0].pageX - chooseArea.x);
      var height = chooseArea.h + (e.touches[0].pageY - chooseArea.y);
      var cutX = chooseArea.xx + (e.touches[0].pageX - chooseArea.x);
      var cutY = chooseArea.yy + (e.touches[0].pageY - chooseArea.y);
      if (e.currentTarget.dataset.scroll === 'xy') {
        var _setData2;

        if (chooseArea.h - (e.touches[0].pageY - chooseArea.y) < 80 || chooseArea.w - (e.touches[0].pageX - chooseArea.x) < 80) return;
        this.setData((_setData2 = {}, _defineProperty(_setData2, 'img.cutX', cutX), _defineProperty(_setData2, 'img.cutY', cutY), _defineProperty(_setData2, 'img.cutH', chooseArea.h - (e.touches[0].pageY - chooseArea.y)), _defineProperty(_setData2, 'img.cutW', chooseArea.w - (e.touches[0].pageX - chooseArea.x)), _setData2));
      } else if (e.currentTarget.dataset.scroll === 'y') {
        var _setData3;

        if (chooseArea.h - (e.touches[0].pageY - chooseArea.y) < 80 || width < 80) return;
        this.setData((_setData3 = {}, _defineProperty(_setData3, 'img.cutY', cutY), _defineProperty(_setData3, 'img.cutH', chooseArea.h - (e.touches[0].pageY - chooseArea.y)), _defineProperty(_setData3, 'img.cutW', width), _setData3));
        height = chooseArea.h - (e.touches[0].pageY - chooseArea.y);
      } else if (e.currentTarget.dataset.scroll === 'x') {
        var _setData4;

        if (height < 80 || chooseArea.w - (e.touches[0].pageX - chooseArea.x) < 80) return;
        this.setData((_setData4 = {}, _defineProperty(_setData4, 'img.cutX', cutX), _defineProperty(_setData4, 'img.cutH', height), _defineProperty(_setData4, 'img.cutW', chooseArea.w - (e.touches[0].pageX - chooseArea.x)), _setData4));
      } else {
        var _setData5;

        if (height < 80 || width < 80) return;
        this.setData((_setData5 = {}, _defineProperty(_setData5, 'img.cutH', height), _defineProperty(_setData5, 'img.cutW', width), _setData5));
      }
    }
  },
  chooseAreaEnd: function chooseAreaEnd() {
    this.setData({
      cutAreaMove: false
    });
  },
  getImageInfo: function getImageInfo(src) {
    var that = this;
    this.setData({
      time: 0.5
    });
    wx.getImageInfo({
      src: src,
      success: function success(res) {
        wx.hideLoading();
        var width = res.width,
            height = res.height;

        var useWidth = width >= height;
        var img = {
          path: res.path,
          y: 20,
          width: useWidth ? maxSize : maxSize * res.width / res.height,
          height: !useWidth ? maxSize : maxSize * res.height / res.width
        };
        img.scale = 1;
        img.rotate = 0;
        img.x = img.width < maxSize ? 20 + (maxSize - img.width) / 2 : 20;
        img.y = img.height < maxSize ? 20 + (maxSize - img.height) / 2 : 20;
        img.cutX = img.x - 2;
        img.cutY = img.y - 2;
        img.cutW = img.width + 4;
        img.cutH = img.height + 4;
        img.cutOW = img.width + 4;
        img.cutOH = img.height + 4;
        that.setData({
          img: img
        }, function () {
          setTimeout(function () {
            that.setData({
              time: 0
            });
          }, 600);
        });
      }
    });
  },
  sliderChange: function sliderChange(e) {
    this.setData({
      'img.scale': e.detail.value
    });
  },
  changeRotate: function changeRotate(e) {
    this.setData({
      'img.rotate': e.detail.value
    });
  },
  go: function go(e) {
    if (e.currentTarget.dataset.type === 'back') wx.navigateBack();else if (e.currentTarget.dataset.type === 'init') {
      this.getImageInfo(this.data.img.path);
    } else {
      this.canvasDraw();
    }
  },
  touchStart: function touchStart(e) {
    // console.log(1)
    start = e.touches;
    if (e.touches.length <= 1) {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
      moveYT = this.data.img.y;
      moveXT = this.data.img.x;
    } else {
      app.toast({
        // content: '囧，小主人的手指太灵活了，无法识别呢，请双指或单指操作'
        content: '囧，小主人的手指太灵活了，无法识别呢，请单指操作'
      });
    }
    // else if (e.touches.length <= 2) {
    //   start = e.touches
    // }
  },
  touchMove: function touchMove(e) {
    // console.log(2)
    if (e.touches.length <= 1 && start.length <= 1) {
      var _setData6;

      // console.log(`3-single`)
      this.setData((_setData6 = {}, _defineProperty(_setData6, 'img.x', moveXT + (e.touches[0].pageX - x)), _defineProperty(_setData6, 'img.y', moveYT + (e.touches[0].pageY - y)), _setData6));
    }
    //  else if (e.touches.length <= 2) {
    //   if (start.length < 1) start = e.touches
    //   let now = e.touches
    //   let scale = (this.getDistance(now[0], now[1]) / this.getDistance(start[0], start[1])).toFixed(1)
    //   let rotate = (this.getAngle(now[0], now[1]) - this.getAngle(start[0], start[1])).toFixed(1)
    //   // console.log(`3-more`)
    //   this.setData({
    //     [`img.scale`]: scale > 2 ? 2 : scale < 1 ? 1 : scale,
    //     [`img.rotate`]: rotate
    //   })
    // }
  },
  touchEnd: function touchEnd() {
    // this.setData({
    //   [`imgArr[${changeIndex}].zIndex`]: beforeIndex
    // })
  },
  bottomOp: function bottomOp(e) {
    switch (e.currentTarget.dataset.op) {
      case 'back':
        wx.navigateBack();
        break;
      case 'confirm':
        this.canvasDraw();
        break;
      default:
        this.setData({
          'bottomOpD': e.currentTarget.dataset.op
        });
        break;
    }
  },
  getDistance: function getDistance(p1, p2) {
    var x = p2.pageX - p1.pageX;
    var y = p2.pageY - p1.pageY;
    return Math.sqrt(x * x + y * y);
  },
  getAngle: function getAngle(p1, p2) {
    var x = p1.pageX - p2.pageX;
    var y = p1.pageY - p2.pageY;
    return Math.atan2(y, x) * 180 / Math.PI;
  },
  canvasDraw: function canvasDraw() {
    var _this2 = this;

    wx.showLoading({
      title: '获取所需区域中',
      mask: true
    });
    var ctx = wx.createCanvasContext('outPic', this);
    // let that = this
    var img = this.data.img;
    ctx.setFillStyle('white');
    ctx.fillRect(0, 0, maxSize * 2, img.height * 2);
    ctx.save();
    ctx.translate(img.x * 2 + img.width, img.y * 2 + img.height);
    ctx.rotate(img.rotate * Math.PI / 180);
    ctx.drawImage(img.path, -(img.width * img.scale), -(img.height * img.scale), img.width * img.scale * 2, img.height * img.scale * 2);
    ctx.restore();
    ctx.draw();
    setTimeout(function () {
      _this2.outImageDouble();
    }, 300);
  },
  outImageDouble: function outImageDouble() {
    var _this3 = this;

    // let that = this
    var img = this.data.img;
    wx.canvasToTempFilePath({
      x: (img.cutX + 2) * 2,
      y: (img.cutY + 2) * 2,
      width: (img.cutW - 4) * 2,
      height: (img.cutH - 4) * 2,
      destWidth: (img.cutW - 4) * 2,
      destHeight: (img.cutH - 4) * 2,
      canvasId: 'outPic',
      success: function success(res) {
        if (res.errMsg === 'canvasToTempFilePath:ok') {
          app.data['userUseImg'] = res.tempFilePath;
          wx.hideLoading();
          if (_this3.data.single === 'single') {
            wx.navigateTo({
              url: '/commonPage/canvas2/step_three/index?single=single'
            });
          } else {
            var index = _this3.data.options.index;
            var _this = getCurrentPages()[getCurrentPages().length - 2];
            _this.setData(_defineProperty({}, 'upImgArr[' + index + '].src', res.tempFilePath), function () {
              _this.getItemImageInfo(index);
              wx.navigateBack({});
            });
          }
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    wx.showLoading({
      title: '加载图片中',
      mask: true
    });
    var that = this;
    app.cloud().getImgCheck(app.data.chooseImage).then(function () {
      that.data.single = options.single;
      that.data.options = options;
      that.getImageInfo(app.data.chooseImage);
    }, function () {
      wx.hideLoading();
      app.toast({
        content: '为了营造绿色的网络环境，检测发现您的图片存在违规内容，请更换图片',
        mask: true
      });
      setTimeout(function () {
        wx.navigateBack();
      }, 2000);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
    // console.log(' ---------- onReady ----------')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    // this.setKill()
    // console.log(' ---------- onShow ----------')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // clearInterval(timer)
    // console.log(' ---------- onHide ----------')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    // clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});