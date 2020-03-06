'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();
var UpLoad = require('../upLoad');
// const bmap = require('../../utils/bmap-wx')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    now: true,
    upImgType: 'img',
    // swiperImg: [],
    swiperImg: [],
    step: 60,
    move_index: -1,
    X: -1,
    desImg: [],
    des: '',
    derationImg: []
  },
  del: function del() {
    if (this.data.swiperImg.length <= 1) {
      return app.toast({ content: '至少保留一张图片哦' });
    }
    var temp = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.data.swiperImg[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        if (!v.active) temp.push(v);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = temp.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _step2$value = _slicedToArray(_step2.value, 2),
            i = _step2$value[0],
            _v = _step2$value[1];

        _v['x'] = 60 * i + 10;
        _v['s'] = i;
        _v['active'] = false;
        // console.log(this.data.swiperImgX[i])
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    temp[0]['active'] = true;
    this.setData({
      swiperImg: temp
    });
  },
  changeImage: function changeImage() {
    if (!this.data.toggle) {
      // let max = this.data.swiperImg.length
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.data.swiperImg.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _step3$value = _slicedToArray(_step3.value, 2),
              i = _step3$value[0],
              v = _step3$value[1];

          v['x'] = 60 * i + 10;
          v['s'] = i;
          v['active'] = false;
          // console.log(this.data.swiperImgX[i])
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.data.swiperImg[0]['active'] = true;
      this.setData({
        swiperImg: this.data.swiperImg
      });
    }
    this.setData({
      toggle: !this.data.toggle
    });
  },
  start: function start(e) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = this.data.swiperImg[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var v = _step4.value;

        v['active'] = false;
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    this.data.swiperImg[e.currentTarget.dataset.index]['active'] = true;
    this.setData({
      animation: true,
      move_index: this.data.swiperImg[e.currentTarget.dataset.index].s * 1,
      swiperImg: this.data.swiperImg
    });
    this.data.X = this.data.swiperImg[e.currentTarget.dataset.index].s * 1;
  },
  movechange: function movechange(e) {
    if (e.detail.source === 'touch') {
      var change = Math.floor(e.detail.x / this.data.step);
      if (this.data.X === change) return;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.data.swiperImg.entries()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _step5$value = _slicedToArray(_step5.value, 2),
              i = _step5$value[0],
              v = _step5$value[1];

          if (v.s === change) {
            var temp2 = this.data.swiperImg[this.data.move_index].x;
            this.data.swiperImg[this.data.move_index].x = this.data.swiperImg[i].x;
            this.setData(_defineProperty({}, 'swiperImg[' + i + '].x', temp2));
            var temp = this.data.swiperImg[i].s;
            this.data.swiperImg[i].s = this.data.swiperImg[this.data.move_index].s;
            this.data.swiperImg[this.data.move_index].s = temp;
            this.data.X = change;
            return;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  },
  end: function end() {
    this.setData({
      animation: false
    });
    var that = this;
    this.data.X = -1;
    var s = that.data.swiperImg.sort(function (a, b) {
      return a.x - b.x;
    });
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = s.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var _step6$value = _slicedToArray(_step6.value, 2),
            i = _step6$value[0],
            v = _step6$value[1];

        v.s = i;
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    this.setData({
      swiperImg: s,
      move_index: -1,
      active_index: -1
    });
  },
  _toggleSpec: function _toggleSpec(e) {
    if (e.currentTarget.dataset.type === 'showSpec2') {
      if (e.currentTarget.dataset.confirm === 'confirm') {
        this.setData({
          showSpec2: !this.data.showSpec2
        }, this.subGoods);
      } else {
        this.setData({
          showSpec2: !this.data.showSpec2
        });
        this.data.up = e.currentTarget.dataset.up || 1;
      }
    } else {
      this.setData({
        showSpec: !this.data.showSpec
      });
    }
  },
  pickerChoose: function pickerChoose(e) {
    this.setData(_defineProperty({}, '' + e.currentTarget.dataset.type, e.currentTarget.dataset.type === 'wareHouse' ? e.detail.value.join(' ') : e.detail.value));
  },
  toggleTime: function toggleTime() {
    this.setData({
      now: !this.data.now
    });
  },
  uploadSingleImg: function uploadSingleImg(url) {
    console.log(this.data.upImgType);
    new UpLoad({
      imgArr: this.data.upImgType === 'img' ? 'swiperImg' : 'desImg',
      this: this
    }).upImgSingle(url);
  },
  inputValue: function inputValue(e) {
    this.data['' + e.currentTarget.dataset.type] = e.detail.value;
  },
  chooseType: function chooseType(e) {
    var that = this;
    this.data.upImgType = e.currentTarget.dataset.type;
    wx.showActionSheet({
      itemList: ['拍照', '作品装裱', '从手机相册选择'],
      success: function success(e) {
        switch (e.tapIndex) {
          case 0:
            new UpLoad({
              imgArr: that.data.upImgType === 'img' ? 'swiperImg' : 'desImg',
              sourceType: ['camera']
            }).chooseImage();
            break;
          case 1:
            wx.navigateTo({
              url: '/commonPage/canvas2/step_one/index?from=sell_release'
            });
            break;
          case 2:
            new UpLoad({
              imgArr: that.data.upImgType === 'img' ? 'swiperImg' : 'desImg',
              sourceType: ['album']
            }).chooseImage();
            break;
          default:
            break;
        }
      }
    });
  },
  subGoods: function subGoods() {
    if (!this.data.title) {
      return app.toast({
        content: '请输入商品标题'
      });
    } else if (!this.data.price) {
      return app.toast({
        content: '请输入商品售价'
      });
    } else if (!this.data.freight) {
      return app.toast({
        content: '请输入商品运费，如不需要运费输入0'
      });
    } else if (!this.data.phone || this.data.phone.length <= 10) {
      return app.toast({
        content: '请输入正确的手机号码'
      });
    }
    var imgsUrl = [];
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = this.data.swiperImg[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var v = _step7.value;

        if (!v.real) {
          return app.toast({
            content: '图片上传中，请稍后尝试'
          });
        }
        imgsUrl.push({
          img_url: v.real
        });
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    var detailUrl = '';
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = this.data.desImg[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var _v2 = _step8.value;

        if (!_v2.real) {
          return app.toast({
            content: '图片上传中，请稍后尝试'
          });
        }
        detailUrl += _v2.real + ',';
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }

    var ss = JSON.stringify({ detail_url: detailUrl, detail_text: this.data.des });
    app.wxrequest({
      url: app.getUrl().sellProductSub,
      data: {
        uid: app.gs('userInfoAll').uid,
        title: this.data.title,
        price: this.data.price,
        freight: this.data.freight,
        des: ss || '',
        phone: this.data.phone,
        is_up: this.data.up,
        delivery: this.data.wareHouse || '广东省 广州市 海珠区',
        imgs_url: JSON.stringify(imgsUrl)
      }
    }).then(function () {
      app.toast({
        content: '添加成功',
        image: '',
        mask: true
      });
      setTimeout(function () {
        wx.navigateBack();
      }, 1500);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options
    });
    if (options.u && options.u.length > 10) {
      this.uploadSingleImg(options.u);
    }
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
  onShow: function onShow() {},

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
  onShareAppMessage: function onShareAppMessage() {
    // return {
    //   title: app.gs('shareText').t || '绣学问，真纹绣',
    //   path: `/pages/index/index`,
    //   imageUrl: app.gs('shareText').g
    // }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});