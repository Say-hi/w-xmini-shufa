'use strict';

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
    capsules: app.data.capsule,
    capsuleTop: app.data.capsuleTop,
    searchHeight: 40,
    searchPosTop: app.data.capsule.bottom + app.data.capsule.top / 2,
    searchPosPad: 10,
    inputColor: '#fff',
    inputbg: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/3.png)',
    page: 0,
    more: true,
    list: []
  },
  onPageScroll: function onPageScroll(e) {
    var searchPosTop = app.data.capsule.bottom + app.data.capsule.top / 2 - e.scrollTop;
    this.setData({
      searchPosTop: searchPosTop <= this.data.capsuleTop ? this.data.capsuleTop : searchPosTop,
      searchPosPad: e.scrollTop >= 100 ? 100 : e.scrollTop < 10 ? 10 : e.scrollTop
    });
  },
  doSearch: function doSearch() {
    var _this2 = this;

    var that = this;
    app.wxrequest({
      url: app.getUrl().stackingSearch,
      data: {
        word: that.data.options.word,
        cid: that.data.options.cid,
        wid: that.data.options.wid,
        page: ++that.data.page
      }
    }).then(function (res) {
      if (res.total <= 0) {
        return app.toast({ content: '没有搜索到相关内容~~' });
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
    console.log(pages);
    var that = pages[pages.length - 3];
    var _this = this;
    that.setData({
      options: {
        wid: _this.data.list[e.currentTarget.dataset.index].data[e.currentTarget.dataset.iindex].wid,
        oid: _this.data.list[e.currentTarget.dataset.index].data[e.currentTarget.dataset.iindex].id
      }
    }, function () {
      that.getDetail();
      wx.navigateBack({ delta: 2 });
    });
  },
  onReachBottom: function onReachBottom() {
    if (!this.data.more) return app.toast({ content: '没有更多内容' });
    this.doSearch();
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function onLoad(options) {
    // type = camera 叠影纠错搜索
    this.setData({
      options: options
    }, this.doSearch);
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