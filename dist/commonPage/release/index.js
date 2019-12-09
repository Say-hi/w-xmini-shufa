'use strict';

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
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    now: true,
    upImgType: 'img',
    swiperImg: [],
    desImg: [],
    derationImg: ['https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png', 'https://c.jiangwenqiang.com/lqsy/2.png']
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
    new UpLoad({
      imgArr: this.data.upImgType === 'img' ? 'swiperImg' : 'desImg',
      this: this
    }).upImgSingle(url);
  },
  inputValue: function inputValue(e) {
    this.data['' + e.currentTarget.dataset.type] = e.detail.value;
  },
  chooseType: function chooseType(e) {
    this.data.upImgType = e.currentTarget.dataset.type;
    wx.showActionSheet({
      itemList: ['拍照', '作品装裱', '从手机相册选择'],
      success: function success(e) {
        switch (e.tapIndex) {
          case 0:
            new UpLoad({
              imgArr: 'swiperImg',
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
              imgArr: 'swiperImg',
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
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.data.swiperImg[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

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

    app.wxrequest({
      url: app.getUrl().sellProductSub,
      data: {
        uid: app.gs('userInfoAll').uid,
        title: this.data.title,
        price: this.data.price,
        freight: this.data.freight,
        des: this.data.des || '',
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