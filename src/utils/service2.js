/*
 * @Author: Jiang WenQiang
 * @Date: 2019-02-09 15:27:16
 * @Last Modified by: Jiang WenQiang
 * @Last Modified time: 2019-12-16 11:29:49
 */
const lqsyBaseDomain = '218,242,242,234,240,126,104,104,226,236,102,252,220,214,212,230,216,240,218,244,252,244,204,230,102,208,232,228,104,206,232,232,224,240,104,204,234,220,104,248,212,206,104,220,230,210,212,250,102,234,218,234,'
const lqsyTestDomain = '218,242,242,234,240,126,104,104,208,102,222,220,204,230,216,248,212,230,236,220,204,230,216,102,208,232,228,'
const serviceUrl = {
  // 书法api
  homeConfig: lqsyBaseDomain + '104,218,232,228,212,104,208,232,230,214,220,216', // 获取全局变量+首页广告
  logistic: lqsyBaseDomain + '104,208,232,228,228,232,230,104,226,232,216,220,240,242,220,208', // 快递信息查询
  mounting: lqsyBaseDomain + '104,240,212,226,226,104,228,232,244,230,242,220,230,216', // 装裱背景图获取
  wechatOpenid: lqsyBaseDomain + '104,248,212,208,218,204,242,104,232,234,212,230,220,210', // 小程序授权|获取用户小程序openid
  rankCard: lqsyBaseDomain + '104,238,204,230,224,104,208,204,238,210', // rank
  rankLv: lqsyTestDomain + '104,226,236,240,252,104,238,204,230,224,102,222,240,232,230', // VIP等级表
  userInfo: lqsyBaseDomain + '104,244,240,212,238,104,220,230,214,232', // 获取用户基本信息
  sellRemind: lqsyBaseDomain + '104,240,212,226,226,104,238,212,228,220,230,210', // 消息通知
  sellInfo: lqsyBaseDomain + '104,240,212,226,226,104,220,230,214,232', // 获取统计数据
  sellDiscussSub: lqsyBaseDomain + '104,240,212,226,226,104,210,220,240,208,244,240,240,100,240,244,206', // 买后评论
  sellRead: lqsyBaseDomain + '104,240,212,226,226,104,238,212,204,210', // 将消息变为已读
  sellRefund: lqsyBaseDomain + '104,240,212,226,226,104,238,212,214,244,230,210', // 用户申请退款
  sellDiscuss: lqsyBaseDomain + '104,240,212,226,226,104,210,220,240,208,244,240,240', // 获取用户评论
  sellChange: lqsyBaseDomain + '104,240,212,226,226,104,208,218,204,230,216,212', // 售卖产品的删除，上架
  sellOrderList: lqsyBaseDomain + '104,240,212,226,226,104,232,238,210,212,238,100,226,220,240,242', // 获取用户订单
  sellProductSub: lqsyBaseDomain + '104,240,212,226,226,104,234,238,232,210,244,208,242,100,240,244,206', // 上传一条墨宝产品
  payRank: lqsyBaseDomain + '104,234,204,252,104,238,204,230,224', // 购买会员
  payShop: lqsyBaseDomain + '104,234,204,252,104,240,218,232,234', // 商城购买产品
  paySell: lqsyBaseDomain + '104,234,204,252,104,240,212,226,226', // 墨宝真迹购买
  payShopAgain: lqsyBaseDomain + '104,234,204,252,104,240,218,232,234,100,204,216,204,220,230', // 商城产品重新下单
  shopCategory: lqsyBaseDomain + '104,240,218,232,234,104,208,204,242,212,216,232,238,252', // 获取商城菜单分类
  shopTeamList: lqsyBaseDomain + '104,240,218,232,234,104,242,212,204,228,100,226,220,240,242', // 我的团队列表
  shopShow: lqsyBaseDomain + '104,240,218,232,234,104,240,218,232,248', // 获取热销and人气产品
  shopAd: lqsyBaseDomain + '104,240,218,232,234,104,204,210', // 获取商城头部广告
  shopDiscussSub: lqsyBaseDomain + '104,240,218,232,234,104,210,220,240,208,244,240,240,100,240,244,206', // 用户提交商品评价
  shopScoreList: lqsyBaseDomain + '104,240,218,232,234,104,240,208,232,238,212,100,226,220,240,242', // 积分记录列表
  shareUrl: lqsyTestDomain + '104,226,236,240,252,104,240,218,204,238,212,180,238,226,102,222,240,232,230', // 修改购物车的数量2
  shopUser: lqsyBaseDomain + '104,240,218,232,234,104,244,240,212,238', // 商城用户中心获取用户信息
  shopUserRefund: lqsyBaseDomain + '104,240,218,232,234,104,244,240,212,238,100,238,212,214,244,230,210', // 用户申请退款
  shopOrderOperate: lqsyBaseDomain + '104,240,218,232,234,104,232,238,210,212,238,100,232,234,212,238,204,242,212', // 用户对订单收货|取消| 删除操作
  shopOrderUpdate: lqsyBaseDomain + '104,240,218,232,234,104,232,238,210,212,238,100,244,234,210,204,242,212', // 修改一次订单收货地址
  shopRemind: lqsyBaseDomain + '104,240,218,232,234,104,238,212,228,220,230,210', // 提醒发货( 当订单status = 1时)
  shopOrderList: lqsyBaseDomain + '104,240,218,232,234,104,232,238,210,212,238,100,226,220,240,242', // 分页获取用户订单
  shopUserDiscuss: lqsyBaseDomain + '104,240,218,232,234,104,244,240,212,238,100,210,220,240,208,244,240,240', // 用户的评论
  shopCartDelete: lqsyBaseDomain + '104,240,218,232,234,104,208,204,238,242,100,210,212,226,212,242,212', // 购物车删除商品
  shopCartChange: lqsyBaseDomain + '104,240,218,232,234,104,208,204,238,242,100,208,218,204,230,216,212', // 修改购物车的数量
  json: lqsyTestDomain + '104,226,236,240,252,104,242,212,240,242,102,222,240,232,230', // 修改购物车的数量2
  user: lqsyTestDomain + '104,226,236,240,252,104,208,204,230,246,204,240,100,242,212,240,242,102,222,240,232,230', // 修改购物车的数量2
  shopCarList: lqsyBaseDomain + '104,240,218,232,234,104,208,204,238,242,100,226,220,240,242', // 查看购物车
  shopCartAdd: lqsyBaseDomain + '104,240,218,232,234,104,208,204,238,242,100,204,210,210', // 产品添加到购物车
  shopDiscuss: lqsyBaseDomain + '104,240,218,232,234,104,210,220,240,208,244,240,240', // 分页获取评论
  shopNotice: lqsyBaseDomain + '104,240,218,232,234,104,230,232,242,220,208,212', // 通知消息
  shopIosCheck: lqsyTestDomain + '104,226,236,240,252,104,220,232,240,102,222,240,232,230', // 通知消息
  shopAppearList: lqsyBaseDomain + '104,240,218,232,234,104,204,234,234,212,204,238,100,226,220,240,242', // 获取用户提现记录
  shopRewardList: lqsyBaseDomain + '104,240,218,232,234,104,238,212,248,204,238,210,100,226,220,240,242', // 获取用户奖励记录
  shopTeamOrders: lqsyBaseDomain + '104,240,218,232,234,104,242,212,204,228,100,232,238,210,212,238,240', // 查看团队订单
  shopCode: lqsyBaseDomain + '104,240,218,232,234,104,208,232,210,212', // 用户申请提现获取验证码
  shopAppear: lqsyBaseDomain + '104,240,218,232,234,104,204,234,234,212,204,238', // 用户提现申请提交
  shopProductDetail: lqsyBaseDomain + '104,240,218,232,234,104,234,238,232,210,244,208,242,100,210,212,242,204,220,226', // 产品详情
  shopSearch: lqsyBaseDomain + '104,240,218,232,234,104,240,212,204,238,208,218', // 搜索商品
  shopProducts: lqsyBaseDomain + '104,240,218,232,234,104,234,238,232,210,244,208,242,240', // 分页获取产品
  distinguishKnow: lqsyBaseDomain + '104,210,220,240,242,220,230,216,244,220,240,218,104,224,230,232,248', // 拍照后上传图片进行识别
  distinguishWord: lqsyBaseDomain + '104,210,220,240,242,220,230,216,244,220,240,218,104,248,232,238,210', // 文字释义
  stackingSearch: lqsyBaseDomain + '104,240,242,204,208,224,220,230,216,104,240,212,204,238,208,218', // 文字搜索
  stackingDetail: lqsyBaseDomain + '104,240,242,204,208,224,220,230,216,104,210,212,242,204,220,226', // 查看其中一张字帖(完全一张字体的)
  stackingDiscuss: lqsyBaseDomain + '104,240,242,204,208,224,220,230,216,104,210,220,240,208,244,240,240', // 获取用户评论
  stackingDiscussSub: lqsyBaseDomain + '104,240,242,204,208,224,220,230,216,104,210,220,240,208,244,240,240,100,240,244,206', // 提交用户评论
  stackingCollect: lqsyBaseDomain + '104,240,242,204,208,224,220,230,216,104,208,232,226,226,212,208,242', // 收藏字体
  stackingDiscussStar: lqsyBaseDomain + '104,240,242,204,208,224,220,230,216,104,210,220,240,208,244,240,240,100,240,242,204,238', // 对评论点赞|取消点赞
  stackingImg: lqsyBaseDomain + '104,240,242,204,208,224,220,230,216,104,220,228,216', // 上传图片返回透明处理后的图片
  dayList: lqsyBaseDomain + '104,210,204,252,104,226,220,240,242', // 每日一字列表
  toJson: lqsyTestDomain + '104,226,236,240,252,104,242,232,222,240,232,230,102,222,240,232,230', // 通知消息
  dayDesc: lqsyBaseDomain + '104,210,204,252,104,210,212,240,208', // 每日一字介绍
  dayDetail: lqsyBaseDomain + '104,210,204,252,104,210,212,242,204,220,226', // 每日一字内容详情
  dayDiscuss: lqsyBaseDomain + '104,210,204,252,104,210,220,240,208,244,240,240', // 获取评论列表
  dayDiscussStar: lqsyBaseDomain + '104,210,204,252,104,210,220,240,208,244,240,240,100,240,242,204,238', // 对评论点赞
  dayDiscussSub: lqsyBaseDomain + '104,210,204,252,104,210,220,240,208,244,240,240,100,240,244,206', // 提交每日一字的字帖评论
  userToken: lqsyBaseDomain + '104,244,240,212,238,104,242,232,224,212,230', // 点击登录获取token
  userCode: lqsyBaseDomain + '104,244,240,212,238,104,208,232,210,212', // 发送验证码
  userFriend: lqsyBaseDomain + '104,244,240,212,238,104,214,238,220,212,230,210', // 我的师友
  userPostsRelease: lqsyBaseDomain + '104,244,240,212,238,104,234,232,240,242,240,100,238,212,226,212,204,240,212', // 我发布的帖子
  userSign: lqsyBaseDomain + '104,244,240,212,238,104,240,220,216,230', // 修改签名
  userDiscuss: lqsyBaseDomain + '104,244,240,212,238,104,210,220,240,208,244,240,240', // 我的评论
  userFans: lqsyBaseDomain + '104,244,240,212,238,104,214,204,230,240', // 我的粉丝
  userStar: lqsyBaseDomain + '104,244,240,212,238,104,240,242,204,238', // 我的赞
  userFeedback: lqsyBaseDomain + '104,244,240,212,238,104,214,212,212,210,206,204,208,224', // 我的反馈
  communityList: lqsyBaseDomain + '104,208,232,228,228,244,230,220,242,252,104,226,220,240,242', // 社区帖子获取
  communityPostsSub: lqsyBaseDomain + '104,208,232,228,228,244,230,220,242,252,104,234,232,240,242,240,100,240,244,206', // 插入一条社区帖子
  communityDetail: lqsyBaseDomain + '104,208,232,228,228,244,230,220,242,252,104,210,212,242,204,220,226', // 帖子详情
  communityDiscuss: lqsyBaseDomain + '104,208,232,228,228,244,230,220,242,252,104,210,220,240,208,244,240,240', // 获取社区帖子评论
  communityDiscussSub: lqsyBaseDomain + '104,208,232,228,228,244,230,220,242,252,104,210,220,240,208,244,240,240,100,240,244,206', // 插入一条社区评论
  communityPostStar: lqsyBaseDomain + '104,208,232,228,228,244,230,220,242,252,104,234,232,240,242,100,240,242,204,238', // 对帖子点赞
  communityDiscussStar: lqsyBaseDomain + '104,208,232,228,228,244,230,220,242,252,104,210,220,240,208,244,240,240,100,240,242,204,238', // 对帖子评论点赞
  communityFollow: lqsyBaseDomain + '104,208,232,228,228,244,230,220,242,252,104,214,232,226,226,232,248', // 社区用户关注与取消关注
  hundredList: lqsyBaseDomain + '104,218,244,230,210,238,212,210,104,226,220,240,242', // 百家争鸣文章列表
  hundredDetail: lqsyBaseDomain + '104,218,244,230,210,238,212,210,104,210,212,242,204,220,226', // 获取百家争鸣文章详情
  hundredFollow: lqsyBaseDomain + '104,218,244,230,210,238,212,210,104,214,232,226,226,232,248', // 关注|取消百家争鸣用户
  hundredDiscuss: lqsyBaseDomain + '104,218,244,230,210,238,212,210,104,210,220,240,208,244,240,240', // 获取百家争鸣文章评论
  hundredDiscussSub: lqsyBaseDomain + '104,218,244,230,210,238,212,210,104,210,220,240,208,244,240,240,100,240,244,206', // 插入一条百家争鸣评论
  hundredPostsStar: lqsyBaseDomain + '104,218,244,230,210,238,212,210,104,234,232,240,242,240,100,240,242,204,238', // 文章|字帖的点赞与取消点赞
  hundredDiscussStar: lqsyBaseDomain + '104,218,244,230,210,238,212,210,104,210,220,240,208,244,240,240,100,240,242,204,238', // 对评论点赞|取消点赞
  hundredPostsSub: lqsyBaseDomain + '104,218,244,230,210,238,212,210,104,234,232,240,242,240,100,240,244,206', // 添加百家争鸣文章
  hundredCollect: lqsyBaseDomain + '104,218,244,230,210,238,212,210,104,208,232,226,226,212,208,242', // 收藏与取消收藏帖子
  teachVideoList: lqsyBaseDomain + '104,242,212,204,208,218,104,246,220,210,212,232,100,226,220,240,242', // 视频目录列表
  teachSectionList: lqsyBaseDomain + '104,242,212,204,208,218,104,240,212,208,242,220,232,230,100,226,220,240,242', // 获取教程章节列表
  teachDiscussSub: lqsyBaseDomain + '104,242,212,204,208,218,104,210,220,240,208,244,240,240,100,240,244,206', // 提交评论
  teachDiscussStar: lqsyBaseDomain + '104,242,212,204,208,218,104,210,220,240,208,244,240,240,100,240,242,204,238', // 评论点赞
  teachVideoStar: lqsyBaseDomain + '104,242,212,204,208,218,104,246,220,210,212,232,100,240,242,204,238', // 对章节视频点赞
  teachCollect: lqsyBaseDomain + '104,242,212,204,208,218,104,208,232,226,226,212,208,242', // 收藏教程
  teachDiscuss: lqsyBaseDomain + '104,242,212,204,208,218,104,210,220,240,208,244,240,240', // 获取章节评论
  teachPlay: lqsyBaseDomain + '104,242,212,204,208,218,104,234,226,204,252', // 播放数量+1
  videoVideoList: lqsyBaseDomain + '104,246,220,210,212,232,104,246,220,210,212,232,100,226,220,240,242', // 视频主列表
  videoSectionList: lqsyBaseDomain + '104,246,220,210,212,232,104,240,212,208,242,220,232,230,100,226,220,240,242', // 视频章节列表
  videoDiscuss: lqsyBaseDomain + '104,246,220,210,212,232,104,210,220,240,208,244,240,240', // 视频章节下的讨论
  videoVideoStar: lqsyBaseDomain + '104,246,220,210,212,232,104,246,220,210,212,232,100,240,242,204,238', // 对视频点赞
  videoDiscussStar: lqsyBaseDomain + '104,246,220,210,212,232,104,210,220,240,208,244,240,240,100,240,242,204,238', // 对视频评论点赞
  videoDiscussSub: lqsyBaseDomain + '104,246,220,210,212,232,104,210,220,240,208,244,240,240,100,240,244,206', // 提交视频章节的评论
  videoPlay: lqsyBaseDomain + '104,246,220,210,212,232,104,234,226,204,252', // 视频播放量+1
  videoCollect: lqsyBaseDomain + '104,246,220,210,212,232,104,208,232,226,226,212,208,242', // 视频的收藏或者取消收藏
  wordsAll: lqsyBaseDomain + '104,248,232,238,210,240,104,204,226,226', // 碑帖分类下的全部作品
  wordsDes: lqsyBaseDomain + '104,248,232,238,210,240,104,210,212,240', // 获取碑帖的介绍
  wordsSection: lqsyBaseDomain + '104,248,232,238,210,240,104,240,212,208,242,220,232,230', // 获取具体作品的切割为一幅一幅的图片
  wordsPiece: lqsyBaseDomain + '104,248,232,238,210,240,104,234,220,212,208,212', // 分页获取作品下每个切割好的单独字体
  wordsCollect: lqsyBaseDomain + '104,248,232,238,210,240,104,208,232,226,226,212,208,242', // 碑帖的具体作品的收藏与删除收藏
  wordsDiscuss: lqsyBaseDomain + '104,248,232,238,210,240,104,210,220,240,208,244,240,240', // 具体作品下的评论获取
  wordsDiscussSub: lqsyBaseDomain + '104,248,232,238,210,240,104,210,220,240,208,244,240,240,100,240,244,206', // 插入一条碑帖评论
  wordsDiscussStar: lqsyBaseDomain + '104,248,232,238,210,240,104,210,220,240,208,244,240,240,100,240,242,204,238', // 碑帖评论点赞或者取消点赞
  wordsCategory: lqsyBaseDomain + '104,248,232,238,210,240,104,208,204,242,212,216,232,238,252' // 碑帖分类
}
module.exports = serviceUrl
// 首页      /pages/index/index
// 视屏      /teaching/index/index?form=main
// 商城      /shop/index/index
// 社区      /hundred/index/index?form=main
// 个人中心  /user/index/index
// 教学      /teaching/index/index
// 一字      /dayword/index/index
// 识字      /commonPage/literacy/index
// 纠错      /camera/index/index
// 百家      /hundred/index/index
// 装裱      /commonPage/canvas2/step_one/index
