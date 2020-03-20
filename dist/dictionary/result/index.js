'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    audioObj: null,
    capsules: app.data.capsule,
    capsuleTop: app.data.capsuleTop,
    searchHeight: 40,
    searchPosTop: app.data.capsule.bottom + app.data.capsule.top / 2,
    searchPosPad: 10,
    inputColor: '#fff',
    inputbg: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/3.png)',
    page: 0,
    authorPage: 0,
    articlePage: 0,
    more: true,
    list: [],
    chooseIndex: [0, 0],
    authorArr: [],
    articleArr: [],
    chooseArr: [{
      t: '123'
    }, {
      t: '13'
    }]
  },
  pickerChange: function pickerChange(e) {
    if (e.target.dataset.index <= 0 && e.detail.value * 1 === this.data.chooseIndex[0] * 1) return;
    var that = this;
    this.setData(_defineProperty({}, 'chooseIndex[' + e.target.dataset.index + ']', e.detail.value), function () {
      if (e.target.dataset.index <= 0) {
        that.data.articlePage = 0;
        that.setData({
          'chooseIndex[1]': 0
        });
        that.getArticle();
      }
    });
  },
  onPageScroll: function onPageScroll(e) {
    var searchPosTop = app.data.capsule.bottom + app.data.capsule.top / 2 - e.scrollTop;
    this.setData({
      searchPosTop: searchPosTop <= this.data.capsuleTop ? this.data.capsuleTop : searchPosTop,
      searchPosPad: e.scrollTop >= 100 ? 100 : e.scrollTop < 10 ? 10 : e.scrollTop
    });
  },
  doSearch: function doSearch(e) {
    var _this2 = this;

    if (!e.detail.value.trim()) return app.toast({ content: '请输入有效内容' });
    var that = this;
    var url = '';
    var data = {};
    this.data.page = 0;
    this.data.list = [];
    this.data.text = e.detail.value.trim();
    switch (this.data.options.type) {
      case 'camera':
        url = app.getUrl().stackingSearch;
        data = {
          word: e.detail.value.trim().slice(0, 1),
          page: ++that.data.page
        };
        break;
      case 'shop':
        url = app.getUrl().shopSearch;
        data = {
          title: e.detail.value.trim(),
          page: ++that.data.page
        };
        break;
      case 'cameraIndex':
        url = app.getUrl().stackingSearch;
        data = {
          word: e.detail.value.trim().slice(0, 1),
          page: ++that.data.page
        };
        break;
      default:
        return app.toast({ content: '未知类型搜索，无法进行操作' });
    }
    app.wxrequest({
      url: url,
      data: data
    }).then(function (res) {
      if (res.total <= 0) {
        return app.toast({ content: '没有搜索到相关内容~~' });
      }
      if (_this2.data.options.type === 'shop') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = res.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var v = _step.value;

            v.url = '/shop/detail/index?id=' + v.id;
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
      }
      that.setData({
        list: that.data.list.concat(res.lists),
        page: ++_this2.data.page
      });
      that.data.more = res.lists.length >= res.pre_page;
    });
  },
  goCamera: function goCamera(e) {
    if (this.data.options.type === 'cameraIndex') {
      wx.redirectTo({
        url: '/camera/detail/index?wid=' + this.data.list[e.currentTarget.dataset.index].data[e.currentTarget.dataset.iindex].wid + '&oid=' + this.data.list[e.currentTarget.dataset.index].data[e.currentTarget.dataset.iindex].id
      });
      return;
    }
    var pages = getCurrentPages();
    var that = pages[pages.length - 2];
    var _this = this;
    that.setData({
      options: {
        wid: _this.data.list[e.currentTarget.dataset.index].data[e.currentTarget.dataset.iindex].wid,
        oid: _this.data.list[e.currentTarget.dataset.index].data[e.currentTarget.dataset.iindex].id
      }
    }, function () {
      that.getDetail();
      wx.navigateBack();
    });
  },
  onReachBottom: function onReachBottom() {
    // if (!this.data.more) return app.toast({content: '没有更多内容'})
    // this.doSearch({
    //   detail: {
    //     value: this.data.text
    //   }
    // })
  },
  goSearch: function goSearch() {
    wx.navigateTo({
      url: '/camera/search/index?type=camera&word=' + this.data.options.word + '&cid=' + this.data.authorArr[this.data.chooseIndex[0]].id + '&wid=' + this.data.articleArr[this.data.chooseIndex[1]].id
    });
  },
  getAuthor: function getAuthor() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var that = this;
    app.wxrequest({
      url: app.getUrl().wordsCategory,
      data: {
        page: ++that.data.authorPage
      }
    }).then(function (res) {
      arr = arr.concat(res.lists);
      if (that.data.authorPage < res.total_page) {
        that.getAuthor(arr);
      } else {
        that.setData({
          authorArr: arr
        }, that.getArticle);
      }
    });
  },
  getArticle: function getArticle() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var that = this;
    app.wxrequest({
      url: app.getUrl().wordsAll,
      data: {
        cid: that.data.authorArr[that.data.chooseIndex[0]].id,
        page: ++that.data.articlePage
      }
    }).then(function (res) {
      arr = arr.concat(res.lists);
      if (that.data.articlePage < res.total_page) {
        that.getArticle(arr);
      } else {
        that.setData({
          articleArr: arr
        });
      }
    });
  },
  inputValue: function inputValue(e) {
    app.inputValue(e, this);
  },
  audio: function audio() {
    var _this3 = this;

    wx.showLoading({
      title: '音频加载中'
    });
    if (!this.data.audioObj) this.data.audioObj = wx.createInnerAudioContext();
    this.data.audioObj.src = 'https://c.jiangwenqiang.com/music/glgl.mp3';
    this.data.audioObj.onCanplay(function () {
      wx.hideLoading();
      _this3.data.audioObj.play();
    });
  },
  search: function search(options) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().dictionarySearch,
      data: {
        cid: options.cid,
        word: options.word,
        page: ++that.data.authorPage
      }
    }).then(function (res) {
      if (res.total < 1) {
        app.toast({
          content: '未搜索到相关书法字帖内容'
        });
      }
      that.setData({
        list: that.data.list ? that.data.list.concat(res.lists) : [].concat(res.lists),
        info: res.lists[0].data[0]
      });
      // that.data.more = res.lists.length >= res.pre_page
    });
  },
  getW: function getW(options) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().distinguishWord,
      data: {
        uid: app.gs('userInfoAll').uid,
        word: options.word
      }
    }).then(function (res) {
      that.setData({
        wInfo: res
      });
    });
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function onLoad(options) {
    this.setData({
      options: options
    });
    // type = camera 叠影纠错搜索
    this.search(options);
    this.getW(options);
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
    // app.toast()
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
    this.data.audioObj && this.data.audioObj.destroy();
    // clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },

  // onShareAppMessage () {
  //   // return {
  //   //   title: app.gs('shareText').t || '绣学问，真纹绣',
  //   //   path: `/pages/index/index`,
  //   //   imageUrl: app.gs('shareText').g
  //   // }
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});