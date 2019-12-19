// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fix: app.data.fix,
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    capsules: app.data.capsule,
    replyIndex: -1,
    page: 0,
    more: true
  },
  _writeComment (e) {
    if (e.currentTarget.dataset.type === 'out') {} else {
      this.setData({
        focus: e.currentTarget.dataset.type === 'in',
        replyIndex: e.currentTarget.dataset.index
      })
    }
  },
  getDiscuss () {
    let that = this
    let url = null
    let data = {}
    switch (this.data.options.type * 1) {
      case 1:
        data = {
          wid: that.data.options.wid,
          state: 2,
          did: that.data.options.did,
          page: ++that.data.page
        }
        url = app.getUrl().wordsDiscuss
        break
      case 7:
        data = {
          wid: that.data.options.wid,
          oid: that.data.options.oid,
          state: 2,
          did: that.data.options.did,
          page: ++that.data.page
        }
        url = app.getUrl().stackingDiscuss
        break
      case 6:
        data = {
          wid: that.data.options.wid,
          state: 2,
          did: that.data.options.did,
          page: ++that.data.page
        }
        url = app.getUrl().dayDiscuss
        break
      case 2:
        data = {
          pid: that.data.options.wid,
          state: 2,
          did: that.data.options.did,
          page: ++that.data.page
        }
        url = app.getUrl().hundredDiscuss
        break
      case 5:
        data = {
          pid: that.data.options.wid,
          state: 2,
          did: that.data.options.did,
          page: ++that.data.page
        }
        url = app.getUrl().communityDiscuss
        break
      case 3:
        url = app.getUrl().teachDiscuss
        data = {
          vid: that.data.options.vid,
          sid: that.data.options.sid,
          state: 2,
          did: that.data.options.did,
          uid: app.gs('userInfoAll').uid,
          page: ++that.data.page
        }
        break
      case 4:
        url = app.getUrl().videoDiscuss
        data = {
          vid: that.data.options.vid,
          sid: that.data.options.sid,
          state: 2,
          did: that.data.options.did,
          uid: app.gs('userInfoAll').uid,
          page: ++that.data.page
        }
        break
      default:
        return app.toast({
          content: '评论类型错误,非有效类型'
        })
    }
    app.wxrequest({
      url,
      data
    }).then(res => {
      if (res.lists.length) {
        for (let v of res.lists) {
          v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm')
        }
        that.setData({
          comment: that.data.comment ? that.data.comment.concat(res.lists) : [].concat(res.lists)
        })
        that.data.more = res.lists.length >= res.pre_page
      }
      that.data.replyIndex = -1
    }, () => {
      --that.data.page
    })
  },
  sendWordsDiscussSub (e) {
    if (!e.detail.value.comment.trim()) {
      return app.toast({
        content: '评论内容不能为空'
      })
    }
    let that = this
    let data = {}
    let url = null
    switch (this.options.type * 1) {
      case 1:
        url = app.getUrl().wordsDiscussSub
        data = {
          wid: that.data.info.wid,
          uid: app.gs('userInfoAll').uid || 10000,
          bid: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].uid : that.data.info.uid,
          did: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].id : that.data.info.id,
          comment: e.detail.value.comment,
          state: 2
        }
        break
      case 7:
        url = app.getUrl().stackingDiscussSub
        data = {
          wid: that.data.info.wid,
          oid: that.data.info.oid,
          uid: app.gs('userInfoAll').uid || 10000,
          bid: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].uid : that.data.info.uid,
          did: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].id : that.data.info.id,
          comment: e.detail.value.comment,
          state: 2
        }
        break
      case 6:
        url = app.getUrl().dayDiscussSub
        data = {
          wid: that.data.info.wid,
          uid: app.gs('userInfoAll').uid || 10000,
          bid: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].uid : that.data.info.uid,
          did: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].id : that.data.info.id,
          comment: e.detail.value.comment,
          state: 2
        }
        break
      case 2:
        url = app.getUrl().hundredDiscussSub
        data = {
          pid: that.data.info.pid,
          uid: app.gs('userInfoAll').uid || 10000,
          bid: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].uid : that.data.info.uid,
          did: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].id : that.data.info.id,
          comment: e.detail.value.comment,
          state: 2
        }
        break
      case 5:
        url = app.getUrl().communityDiscussSub
        data = {
          pid: that.data.info.pid,
          uid: app.gs('userInfoAll').uid || 10000,
          bid: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].uid : that.data.info.uid,
          did: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].id : that.data.info.id,
          comment: e.detail.value.comment,
          state: 2
        }
        break
      case 3:
        url = app.getUrl().teachDiscussSub
        data = {
          vid: that.data.options.vid,
          sid: that.data.options.sid,
          uid: app.gs('userInfoAll').uid || 10000,
          bid: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].uid : that.data.info.uid,
          did: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].id : that.data.info.id,
          comment: e.detail.value.comment,
          state: 2
        }
        break
      case 4:
        url = app.getUrl().videoDiscussSub
        data = {
          vid: that.data.options.vid,
          sid: that.data.options.sid,
          uid: app.gs('userInfoAll').uid || 10000,
          bid: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].uid : that.data.info.uid,
          did: that.data.replyIndex >= 0 ? that.data.comment[that.data.replyIndex].id : that.data.info.id,
          comment: e.detail.value.comment,
          state: 2
        }
        break
      default:
        return app.toast({
          content: '类型错误，非有效的评论类型'
        })
    }
    app.wxrequest({
      url,
      data
    }).then(() => {
      app.toast({
        content: '评论成功,系统审核通过后即可展示',
        image: ''
      })
      that.setData({
        commentValue: ''
      })
      that.data.page = 0
      that.data.comment = null
      that.data.more = true
      that.getDiscuss()
    })
  },
  changeStar (e) {
    // console.log(e)
    let that = this
    let url = ''
    let data = {}
    switch (this.options.type * 1) {
      case 1:
        url = app.getUrl().wordsDiscussStar
        data = {
          did: e.currentTarget.dataset.index < 0 ? that.data.info.id : that.data.comment[e.currentTarget.dataset.index].id,
          uid: app.gs('userInfoAll').uid,
          wid: that.data.info.wid,
          state: e.currentTarget.dataset.index < 0 ? that.data.info.is_star > 0 ? 2 : 1 : that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
        }
        break
      case 7:
        url = app.getUrl().stackingDiscussStar
        data = {
          did: e.currentTarget.dataset.index < 0 ? that.data.info.id : that.data.comment[e.currentTarget.dataset.index].id,
          uid: app.gs('userInfoAll').uid,
          wid: that.data.info.wid,
          oid: that.data.info.oid,
          state: e.currentTarget.dataset.index < 0 ? that.data.info.is_star > 0 ? 2 : 1 : that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
        }
        break
      case 6:
        url = app.getUrl().dayDiscussStar
        data = {
          did: e.currentTarget.dataset.index < 0 ? that.data.info.id : that.data.comment[e.currentTarget.dataset.index].id,
          uid: app.gs('userInfoAll').uid,
          wid: that.data.info.wid,
          state: e.currentTarget.dataset.index < 0 ? that.data.info.is_star > 0 ? 2 : 1 : that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
        }
        break
      case 2:
        url = app.getUrl().hundredDiscussStar
        data = {
          did: e.currentTarget.dataset.index < 0 ? that.data.info.id : that.data.comment[e.currentTarget.dataset.index].id,
          uid: app.gs('userInfoAll').uid,
          pid: that.data.info.pid,
          state: e.currentTarget.dataset.index < 0 ? that.data.info.is_star > 0 ? 2 : 1 : that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
        }
        break
      case 5:
        url = app.getUrl().communityDiscussStar
        data = {
          did: e.currentTarget.dataset.index < 0 ? that.data.info.id : that.data.comment[e.currentTarget.dataset.index].id,
          uid: app.gs('userInfoAll').uid,
          pid: that.data.info.pid,
          state: e.currentTarget.dataset.index < 0 ? that.data.info.is_star > 0 ? 2 : 1 : that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
        }
        break
      case 3:
        url = app.getUrl().teachDiscussStar
        data = {
          vid: that.data.options.vid,
          sid: that.data.options.sid,
          did: e.currentTarget.dataset.index < 0 ? that.data.info.id : that.data.comment[e.currentTarget.dataset.index].id,
          uid: app.gs('userInfoAll').uid,
          state: e.currentTarget.dataset.index < 0 ? that.data.info.is_star > 0 ? 2 : 1 : that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
        }
        break
      case 4:
        url = app.getUrl().videoDiscussStar
        data = {
          vid: that.data.options.vid,
          sid: that.data.options.sid,
          did: e.currentTarget.dataset.index < 0 ? that.data.info.id : that.data.comment[e.currentTarget.dataset.index].id,
          uid: app.gs('userInfoAll').uid,
          state: e.currentTarget.dataset.index < 0 ? that.data.info.is_star > 0 ? 2 : 1 : that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
        }
        break
      default:
        return app.toast({
          content: '类型错误，非有效的评论类型'
        })
    }
    app.wxrequest({
      url,
      data
    }).then(() => {
      if (e.currentTarget.dataset.index < 0) {
        that.setData({
          [`info.is_star`]: that.data.info.is_star > 0 ? -1 : 1,
          [`info.star`]: that.data.info.is_star > 0 ? --that.data.info.star : ++that.data.info.star
        })
      } else {
        that.setData({
          [`comment[${e.currentTarget.dataset.index}].is_star`]: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? -1 : 1,
          [`comment[${e.currentTarget.dataset.index}].star`]: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? --that.data.comment[e.currentTarget.dataset.index].star : ++that.data.comment[e.currentTarget.dataset.index].star
        })
      }
    })
  },
  goReply (e) {
    app.su('reply', this.data.comment[e.currentTarget.dataset.index])
    let options = ''
    switch (this.data.options.type * 1) {
      case 1:
        options = `wid=${this.data.options.wid}&state=2&did=${this.data.comment[e.currentTarget.dataset.index].id}&type=1`
        break
      case 6:
        options = `wid=${this.data.options.wid}&state=2&did=${this.data.comment[e.currentTarget.dataset.index].id}&type=6`
        break
      case 7:
        options = `wid=${this.data.options.wid}&oid=${this.data.options.oid}&state=2&did=${this.data.comment[e.currentTarget.dataset.index].id}&type=7`
        break
      case 2:
        options = `wid=${this.data.options.wid}&state=2&did=${this.data.comment[e.currentTarget.dataset.index].id}&type=2`
        break
      case 5:
        options = `wid=${this.data.options.wid}&state=2&did=${this.data.comment[e.currentTarget.dataset.index].id}&type=5`
        break
      case 3:
        options = `vid=${this.data.options.vid}&state=2&did=${this.data.comment[e.currentTarget.dataset.index].id}&type=3&sid=${this.data.options.sid}`
        break
      case 4:
        options = `vid=${this.data.options.vid}&state=2&did=${this.data.comment[e.currentTarget.dataset.index].id}&type=4&sid=${this.data.options.sid}`
        break
      default:
        return app.toast({
          content: '评论类型错误,非有效类型'
        })
    }
    wx.redirectTo({
      url: `/commonPage/reply/index?${options}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // type = 1 碑帖
    // type = 2 百家
    // type = 3 书法教学
    // type = 4 视屏
    // type = 5 社区
    // type = 6 每日一字
    // type = 7 叠影纠错
    this.setData({
      options,
      info: app.gs('reply')
    }, this.getDiscuss)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // console.log(' ---------- onReady ----------')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // this.setKill()
    // console.log(' ---------- onShow ----------')
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // clearInterval(timer)
    // console.log(' ---------- onHide ----------')
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },
  onShareAppMessage () {
    // return {
    //   title: app.gs('shareText').t || '绣学问，真纹绣',
    //   path: `/pages/index/index`,
    //   imageUrl: app.gs('shareText').g
    // }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
