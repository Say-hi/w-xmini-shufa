// 获取全局应用程序实例对象
const app = getApp()
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
    page: 0,
    more: true,
    list: []
  },
  getNotice () {
    app.wxrequest({
      url: app.getUrl().sellRemind,
      data: {
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        switch (v.status * 1) {
          case 1:
            v.status = '审核通过'
            v['pass'] = true
            break
          case 2:
            v.status = '已售出产品'
            v['pass'] = true
            break
          case -1:
            v.status = '审核中'
            break
          case -2:
            v.status = '审核未通过'
            break
        }
      }
      this.setData({
        list: this.data.list.concat(res.lists)
      }, () => {
        this.sellRead(res.lists)
      })
      this.data.more = res.lists.length >= res.pre_page
    })
  },
  sellRead (res) {
    let ids = []
    for (let v of res) {
      v.is_read < 0 && ids.push({
        id: v.id
      })
    }
    if (!ids.length) return
    app.wxrequest({
      url: app.getUrl().sellRead,
      data: {
        uid: app.gs('userInfoAll').uid,
        ids: JSON.stringify(ids)
      }
    })
  },
  onReachBottom () {
    if (!this.data.more) {
      return app.toast({
        content: '没有更多内容了'
      })
    }
    this.getNotice()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.getNotice()
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
  onShow () {},
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
