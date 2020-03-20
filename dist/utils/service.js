'use strict';

/**
 * Created by Administrator on 2017/6/2.
 */
// const baseDomain = 'https://teach.idwenshi.com/teaching/public/index.php'
// const shopBaseDomain = 'https://teach.idwenshi.com/teach/teach/web/index.php'
// const webBaseDomain = 'https://teach.idwenshi.com/teach/api/web/index.php'
// const baseDomain2 = 'https://mask.idwenshi.com/masks/frontend/web/index.php'
// let baseDomain = 'https://www.1688rm.com'
// const lqsyBaseDomain = 'http://120.24.75.4/books/api/web/index.php'
var lqsyBaseDomain = 'https://lq.yifengshuyuan.com/books/api/web/index.php';
var lqsyTestDomain = 'https://c.jiangwenqiang.com';
var serviceUrl = {
  // style: baseDomain + '/home/page', // 不填默认为1, 1表示中间菜单,2表示底部菜单,3表示广告图
  // enum: baseDomain + '/home/enum', // 获取标签
  // search: baseDomain + '/home/search', // 获取标签
  // login: baseDomain + '/weixin/login', // 登陆
  // course: baseDomain + '/course/last', // 课程
  // courseSearch: baseDomain + '/course/search', // 搜索课程
  // courseDetail: baseDomain + '/course/detail', // 课程详情
  // courseStar: baseDomain + '/course/star', // 给课程评分
  // courseEvaluateSub: baseDomain + '/course/evaluate_sub', // 提交课程评论
  // courseDiscussSub: baseDomain + '/course/discuss_sub', // 提交评论的评论
  // courseDiscuss: baseDomain + '/course/discuss', // 获取评论的评论
  // evaluate: baseDomain + '/course/evaluate', // 课程评论
  // question: baseDomain + '/question/problem', // 问答
  // questionDetail: baseDomain + '/question/detail', // 问答详情
  // questionDiscuss: baseDomain + '/question/discuss', // 问答回复列表
  // questionDiscussSub: baseDomain + '/question/discuss_sub', // 问答回复
  // questionProblemSub: baseDomain + '/question/problem_sub', // 提问
  // questionProblemHot: baseDomain + '/question/problem_hot', // 热门提问
  // questionProblemMy: baseDomain + '/question/problem_my', // 我的提问
  // questionProblemMyCount: baseDomain + '/question/problem_my_count', // 我的提问未读数量
  // upVideo: baseDomain + '/upload/video', // 视频上传
  // dotNearby: baseDomain + '/dot/nearby', // 附近门店
  // dotDetail: baseDomain + '/dot/detail', // 门店详情
  // dotRelease: baseDomain + '/dot/release', // 门店课程
  // dotSearch: baseDomain + '/dot/search', // 门店搜索
  // activeNearby: baseDomain + '/active/nearby', // 附近课程
  // activeDetail: baseDomain + '/active/detail', // 附近课程
  // activeSearch: baseDomain + '/active/search', // 线下课程搜索
  // activeEnum: baseDomain + '/active/enum', // 获取报名所需要的字段
  // activeSign: baseDomain + '/active/sign_up', // 报名活动
  // payActive: baseDomain + '/pay/active', // 支付
  // payActiveAgain: baseDomain + '/pay/active_again', // 二次支付
  // userFeedback: baseDomain + '/user/feedback', // 反馈
  // userActive: baseDomain + '/user/active', // 用户预约
  // userCollect: baseDomain + '/user/collect', // 用户收集的内容
  // userActivePay: baseDomain + '/user/active_pay', // 用户订单
  // userActiveChange: baseDomain + '/user/active_change', // 用户改变订单状态
  // userCollectSub: baseDomain + '/user/collect_sub', // 用户收藏
  // userCollectCancel: baseDomain + '/user/collect_cancel', // 用户取消收藏
  // userLogistic: baseDomain + '/user/logistic', // 物流查询
  // userInfo: baseDomain + '/user/info', // 用户信息
  // userGift: baseDomain + '/user/gift', // 礼包
  // formid: baseDomain + '/user/formid', // 收集formid
  // payDot: baseDomain + '/pay/dot', // 支付成为门店入驻
  // homeSearch: baseDomain + '/home/search', // 搜索关键字
  // homeGrow: baseDomain + '/home/grow', // 成长阶梯
  // homeEquity: baseDomain + '/home/equity', // 入驻
  // homeReport: baseDomain + '/home/report', // 举报
  // upImage: baseDomain + '/upload/image', // 图片上传
  // // 门店端接口
  // teacherUserVideo: baseDomain + '/teacher/user/video', // 获取上传过的视频
  // teacherCourseSub: baseDomain + '/teacher/course/sub', // 教师保存上传视频信息
  // teacherCourseDel: baseDomain + '/teacher/course/del', // 教师删除上传视频信息
  // teacherDotSub: baseDomain + '/teacher/dot/sub', // 门店信息插入记录
  // teacherActiveSub: baseDomain + '/teacher/active/sub', // 线下课程保存
  // teacherActiveDel: baseDomain + '/teacher/active/del', // 线下课程删除
  // teacherDotDetail: baseDomain + '/teacher/dot/detail', // 获取门店信息
  // teacherUserIncome: baseDomain + '/teacher/user/income', // 收益
  // teacherUserMessage: baseDomain + '/teacher/user/message', // 消息通知
  // teacherUserSys: baseDomain + '/teacher/user/sys_notice', // 系统通知
  // teacherUserSysDetail: baseDomain + '/teacher/user/sys_detail', // 系统通修改为已读
  // teacherUserEvaluateMsg: baseDomain + '/teacher/user/evaluate_msg', // 教师查看用户对视频的评价
  // teacherUserVideoCollect: baseDomain + '/teacher/user/video_collect', // 教师查看用户的收藏的信息列表
  // teacherUserCash: baseDomain + '/teacher/user/cash', // 教师提现
  // teacherDotShare: baseDomain + '/teacher/dot/share', // 教师邀请
  // teacherActiveMsg: baseDomain + '/teacher/active/msg', // 获取一条驻店课程消息
  // teacherUserActive: baseDomain + '/teacher/user/active', // 获取线下课程
  // // 商城接口
  // shopCategoryList: shopBaseDomain + '/category/list', // 分类
  // shopProductList: shopBaseDomain + '/product/list', // 商品
  // shopInfo: shopBaseDomain + '/shop/info', // 商城信息
  // shopVideoIncrease: shopBaseDomain + '/video/increase', // 增加点击量
  // shopProduct: shopBaseDomain + '/product/detail', // 商品详情
  // shopUserInfo: shopBaseDomain + '/user/info', // 商城用户信息
  // shopUserReal: shopBaseDomain + '/user/real', // 商城用户名字修改
  // shopUserFund: shopBaseDomain + '/user/fund', // 商城用户资金管理
  // shopUserCash: shopBaseDomain + '/user/cash', // 商城用户资金提现
  // shopUserInDetail: shopBaseDomain + '/user/indetail', // 商城用户收益明细
  // shopUserRecord: shopBaseDomain + '/user/record', // 商城用户提现记录
  // shopUserNotice: shopBaseDomain + '/user/notice', // 商城用户消息
  // shopUserQrcode: shopBaseDomain + '/user/qrcode', // 商城用户二维码
  // shopUserRead: shopBaseDomain + '/user/read', // 商城用户消息已读
  // shopUserExplain: shopBaseDomain + '/user/explain', // 商城提现说明
  // shopCartAdd: shopBaseDomain + '/cart/add', // 商城添加到购物车
  // shopCartList: shopBaseDomain + '/cart/list', // 商城购物车
  // shopCartDelete: shopBaseDomain + '/cart/delete', // 商城购物车删除
  // shopCartChange: shopBaseDomain + '/cart/change', // 商城购物车数量修改
  // shopCenter: shopBaseDomain + '/shop/center', // 商城中心
  // shopSale: shopBaseDomain + '/shop/sale', // 商城中心
  // shopRelease: shopBaseDomain + '/shop/release', // 商城产品上传
  // shoPayDirect: shopBaseDomain + '/pay/direct', // 商城直接购买
  // shoPayCart: shopBaseDomain + '/pay/cart', // 商城购物车购买
  // shopAd: shopBaseDomain + '/shop/ad', // 商城广告
  // shopEdit: shopBaseDomain + '/shop/edit', // 商城产品编辑
  // shopSet: shopBaseDomain + '/shop/set', // 商城店铺名字修改
  // shopUserOrders: shopBaseDomain + '/user/orders', // 商城用户店铺订单
  // shopUserOperate: shopBaseDomain + '/user/operate', // 商城用户店铺订单状态修改
  // shopExpress: shopBaseDomain + '/shop/express', // 商城订单发货
  // shopTeam: shopBaseDomain + '/shop/team', // 商城分销商
  // shopPayAgain: shopBaseDomain + '/pay/again', // 商城再次支付
  // shopDeal: shopBaseDomain + '/shop/deal', // 商城产品操作
  // shopBinding: shopBaseDomain + '/publicly/binding', // 商城用户绑定
  // shopPhone: shopBaseDomain + '/wechat/phone', // 解密手机
  // shopMoneyRuler: shopBaseDomain + '/shop/moneyruler', // 解密手机
  // shopVideoList: shopBaseDomain + '/video/list', // 视频列表
  // rechargeList: shopBaseDomain + '/recharge/lists', // 视频列表
  // rechargePay: shopBaseDomain + '/recharge/pay', // 视频列表
  // userscore: shopBaseDomain + '/user/score', // 视频列表
  // userrecharge: shopBaseDomain + '/user/recharge', // 视频列表
  // shopstar: shopBaseDomain + '/shop/star', // 视频列表
  // ruleexplain: shopBaseDomain + '/rule/explain', // 视频列表
  // refundGoods: shopBaseDomain + '/user/refund', // 退款申请
  // goodsrefund: shopBaseDomain + '/shop/refund-detail', // 查询退款申请
  // confirmrefund: shopBaseDomain + '/shop/refund', // 商家确认退款
  // // 拼团
  // pinlist: shopBaseDomain + '/assemble/list',  // 拼团列表页
  // pindetail: shopBaseDomain + '/assemble/detail',  // 拼团详情页
  // pinteam: shopBaseDomain + '/assemble/group',  // 正在拼团的用户信息列表
  // pinrelease: shopBaseDomain + '/shops/release',  // 发布拼团商品
  // refund: shopBaseDomain + '/assemble/refund',  // 拼团退款
  // pinshoporder: shopBaseDomain + '/shops/orders',  // 商家订单查看
  // pinglaunch: shopBaseDomain + '/assemble/launch',  // 拼团分享进入
  // pingdirect: shopBaseDomain + '/payment/direct',  // 拼团支付
  // pinedit: shopBaseDomain + '/shops/edit',  // 拼团商品二次编辑
  // skip: shopBaseDomain + '/user/skip',  // 红包跳转
  // pinuserorder: shopBaseDomain + '/users/orders',  // 拼团用户订单
  // pingrefund: shopBaseDomain + '/shops/refund',  // 商家确认退款
  // pinqrcode: shopBaseDomain + '/assemble/qrcode',  // 获取拼单二维码
  // pinoperate: shopBaseDomain + '/users/operate',  // 修改订单状态
  // pinorefund: shopBaseDomain + '/shops/refund-detail',  // 查询退款申请
  // pinenter: shopBaseDomain + '/assemble/enter',  // 图片
  // shopsExpress: shopBaseDomain + '/shops/express', // 商城订单发货
  // pinagentslist: shopBaseDomain + '/shops/assemble-list', // 商家商品列表
  // pindeal: shopBaseDomain + '/shops/deal', // 拼团删除产品
  // qrcode: shopBaseDomain + '/product/qrcode', // 二维码
  // // 公众号接口
  // profitDetail: webBaseDomain + '/user/profit-detail',
  // finance: webBaseDomain + '/shop/finance', // 查看财务信息
  // setfinance: webBaseDomain + '/shop/set-finance', // 设置财务账号
  // // 素材相关接口
  // scMenu: shopBaseDomain + '/material/menu',
  // scList: shopBaseDomain + '/material/list',
  // scAdd: shopBaseDomain + '/material/count',
  // scDetail: shopBaseDomain + '/material/detail',
  // 书法api
  homeConfig: lqsyBaseDomain + '/home/config', // 获取全局变量+首页广告
  logistic: lqsyBaseDomain + '/common/logistic', // 快递信息查询
  mounting: lqsyBaseDomain + '/sell/mounting', // 装裱背景图获取
  wechatOpenid: lqsyBaseDomain + '/wechat/openid', // 小程序授权|获取用户小程序openid
  rankCard: lqsyBaseDomain + '/rank/card', // rank
  codeInvite: lqsyBaseDomain + '/wechat/code-invite', // rank
  rankLv: lqsyTestDomain + '/lqsy/rank.json', // VIP等级表
  userInfo: lqsyBaseDomain + '/user/info', // 获取用户基本信息
  userBind: lqsyBaseDomain + '/user/bind', // 获取用户基本信息
  sellRemind: lqsyBaseDomain + '/sell/remind', // 消息通知
  sellInfo: lqsyBaseDomain + '/sell/info', // 获取统计数据
  sellDiscussSub: lqsyBaseDomain + '/sell/discuss-sub', // 买后评论
  sellRead: lqsyBaseDomain + '/sell/read', // 将消息变为已读
  sellRefund: lqsyBaseDomain + '/sell/refund', // 用户申请退款
  sellDiscuss: lqsyBaseDomain + '/sell/discuss', // 获取用户评论
  sellChange: lqsyBaseDomain + '/sell/change', // 售卖产品的删除，上架
  sellOrderList: lqsyBaseDomain + '/sell/order-list', // 获取用户订单
  sellProductSub: lqsyBaseDomain + '/sell/product-sub', // 上传一条墨宝产品
  payRank: lqsyBaseDomain + '/pay/rank', // 购买会员
  payShop: lqsyBaseDomain + '/pay/shop', // 商城购买产品
  paySell: lqsyBaseDomain + '/pay/sell', // 墨宝真迹购买
  payShopAgain: lqsyBaseDomain + '/pay/shop-again', // 商城产品重新下单
  shopCategory: lqsyBaseDomain + '/shop/category', // 获取商城菜单分类
  shopTeamList: lqsyBaseDomain + '/shop/team-list', // 我的团队列表
  shopShow: lqsyBaseDomain + '/shop/show', // 获取热销and人气产品
  shopAd: lqsyBaseDomain + '/shop/ad', // 获取商城头部广告
  sellProductDetail: lqsyBaseDomain + '/sell/product-detial', // 获取商城头部广告
  shopDiscussSub: lqsyBaseDomain + '/shop/discuss-sub', // 用户提交商品评价
  shopScoreList: lqsyBaseDomain + '/shop/score-list', // 积分记录列表
  shareUrl: lqsyTestDomain + '/lqsy/shareUrl.json', // 修改购物车的数量2
  shopUser: lqsyBaseDomain + '/shop/user', // 商城用户中心获取用户信息
  shopUserRefund: lqsyBaseDomain + '/shop/user-refund', // 用户申请退款
  commonUpload: lqsyBaseDomain + '/common/upload', // 用户申请退款
  shopOrderOperate: lqsyBaseDomain + '/shop/order-operate', // 用户对订单收货|取消| 删除操作
  shopOrderUpdate: lqsyBaseDomain + '/shop/order-update', // 修改一次订单收货地址
  shopRemind: lqsyBaseDomain + '/shop/remind', // 提醒发货( 当订单status = 1时)
  shopOrderList: lqsyBaseDomain + '/shop/order-list', // 分页获取用户订单
  shopUserDiscuss: lqsyBaseDomain + '/shop/user-discuss', // 用户的评论
  shopCartDelete: lqsyBaseDomain + '/shop/cart-delete', // 购物车删除商品
  shopCartChange: lqsyBaseDomain + '/shop/cart-change', // 修改购物车的数量
  json: lqsyTestDomain + '/lqsy/test.json', // 修改购物车的数量2
  user: lqsyTestDomain + '/lqsy/canvas-test.json', // 修改购物车的数量2
  checkPrivier: lqsyTestDomain + '/lqsy/checkPrivier.json',
  shopCarList: lqsyBaseDomain + '/shop/cart-list', // 查看购物车
  shopCartAdd: lqsyBaseDomain + '/shop/cart-add', // 产品添加到购物车
  shopDiscuss: lqsyBaseDomain + '/shop/discuss', // 分页获取评论
  shopNotice: lqsyBaseDomain + '/shop/notice', // 通知消息
  shopIosCheck: lqsyTestDomain + '/lqsy/ios.json', // 通知消息
  shopAppearList: lqsyBaseDomain + '/shop/appear-list', // 获取用户提现记录
  shopRewardList: lqsyBaseDomain + '/shop/reward-list', // 获取用户奖励记录
  shopTeamOrders: lqsyBaseDomain + '/shop/team-orders', // 查看团队订单
  shopCode: lqsyBaseDomain + '/shop/code', // 用户申请提现获取验证码
  shopAppear: lqsyBaseDomain + '/shop/appear', // 用户提现申请提交
  shopProductDetail: lqsyBaseDomain + '/shop/product-detail', // 产品详情
  shopSearch: lqsyBaseDomain + '/shop/search', // 搜索商品
  shopProducts: lqsyBaseDomain + '/shop/products', // 分页获取产品
  distinguishKnow: lqsyBaseDomain + '/distinguish/know', // 拍照后上传图片进行识别
  distinguishWord: lqsyBaseDomain + '/distinguish/word', // 文字释义
  stackingSearch: lqsyBaseDomain + '/stacking/search', // 文字搜索
  baseImageInfo: lqsyTestDomain + '/lqsy/baseImageInfo.json', // 修改购物车的数量2
  stackingDetail: lqsyBaseDomain + '/stacking/detail', // 查看其中一张字帖(完全一张字体的)
  stackingDiscuss: lqsyBaseDomain + '/stacking/discuss', // 获取用户评论
  stackingDiscussSub: lqsyBaseDomain + '/stacking/discuss-sub', // 提交用户评论
  stackingCollect: lqsyBaseDomain + '/stacking/collect', // 收藏字体
  stackingDiscussStar: lqsyBaseDomain + '/stacking/discuss-star', // 对评论点赞|取消点赞
  stackingImg: lqsyBaseDomain + '/stacking/img', // 上传图片返回透明处理后的图片
  dayList: lqsyBaseDomain + '/day/list', // 每日一字列表
  toJson: lqsyTestDomain + '/lqsy/tojson.json', // 通知消息
  dayDesc: lqsyBaseDomain + '/day/desc', // 每日一字介绍
  dayDetail: lqsyBaseDomain + '/day/detail', // 每日一字内容详情
  dayDiscuss: lqsyBaseDomain + '/day/discuss', // 获取评论列表
  dayDiscussStar: lqsyBaseDomain + '/day/discuss-star', // 对评论点赞
  dayDiscussSub: lqsyBaseDomain + '/day/discuss-sub', // 提交每日一字的字帖评论
  userToken: lqsyBaseDomain + '/user/token', // 点击登录获取token
  userCode: lqsyBaseDomain + '/user/code', // 发送验证码
  userFriend: lqsyBaseDomain + '/user/friend', // 我的师友
  userPostsRelease: lqsyBaseDomain + '/user/posts-release', // 我发布的帖子
  userSign: lqsyBaseDomain + '/user/sign', // 修改签名
  userDiscuss: lqsyBaseDomain + '/user/discuss', // 我的评论
  userFans: lqsyBaseDomain + '/user/fans', // 我的粉丝
  userStar: lqsyBaseDomain + '/user/star', // 我的赞
  userFeedback: lqsyBaseDomain + '/user/feedback', // 我的反馈
  communityList: lqsyBaseDomain + '/community/list', // 社区帖子获取
  communityPostsSub: lqsyBaseDomain + '/community/posts-sub', // 插入一条社区帖子
  communityDetail: lqsyBaseDomain + '/community/detail', // 帖子详情
  communityDiscuss: lqsyBaseDomain + '/community/discuss', // 获取社区帖子评论
  communityDiscussSub: lqsyBaseDomain + '/community/discuss-sub', // 插入一条社区评论
  communityPostStar: lqsyBaseDomain + '/community/post-star', // 对帖子点赞
  communityDiscussStar: lqsyBaseDomain + '/community/discuss-star', // 对帖子评论点赞
  communityFollow: lqsyBaseDomain + '/community/follow', // 社区用户关注与取消关注
  hundredList: lqsyBaseDomain + '/hundred/list', // 百家争鸣文章列表
  hundredDetail: lqsyBaseDomain + '/hundred/detail', // 获取百家争鸣文章详情
  hundredFollow: lqsyBaseDomain + '/hundred/follow', // 关注|取消百家争鸣用户
  hundredDiscuss: lqsyBaseDomain + '/hundred/discuss', // 获取百家争鸣文章评论
  hundredDiscussSub: lqsyBaseDomain + '/hundred/discuss-sub', // 插入一条百家争鸣评论
  hundredPostsStar: lqsyBaseDomain + '/hundred/posts-star', // 文章|字帖的点赞与取消点赞
  hundredDiscussStar: lqsyBaseDomain + '/hundred/discuss-star', // 对评论点赞|取消点赞
  hundredPostsSub: lqsyBaseDomain + '/hundred/posts-sub', // 添加百家争鸣文章
  hundredCollect: lqsyBaseDomain + '/hundred/collect', // 收藏与取消收藏帖子
  teachVideoList: lqsyBaseDomain + '/teach/video-list', // 视频目录列表
  teachSectionList: lqsyBaseDomain + '/teach/section-list', // 获取教程章节列表
  teachDiscussSub: lqsyBaseDomain + '/teach/discuss-sub', // 提交评论
  teachDiscussStar: lqsyBaseDomain + '/teach/discuss-star', // 评论点赞
  teachVideoStar: lqsyBaseDomain + '/teach/video-star', // 对章节视频点赞
  teachCollect: lqsyBaseDomain + '/teach/collect', // 收藏教程
  teachDiscuss: lqsyBaseDomain + '/teach/discuss', // 获取章节评论
  teachPlay: lqsyBaseDomain + '/teach/play', // 播放数量+1
  videoVideoList: lqsyBaseDomain + '/video/video-list', // 视频主列表
  videoSectionList: lqsyBaseDomain + '/video/section-list', // 视频章节列表
  videoDiscuss: lqsyBaseDomain + '/video/discuss', // 视频章节下的讨论
  videoVideoStar: lqsyBaseDomain + '/video/video-star', // 对视频点赞
  videoDiscussStar: lqsyBaseDomain + '/video/discuss-star', // 对视频评论点赞
  orderListOperate: lqsyBaseDomain + '/shop/order-list-operate', // 订单详情单一产品收货api
  videoDiscussSub: lqsyBaseDomain + '/video/discuss-sub', // 提交视频章节的评论
  videoPlay: lqsyBaseDomain + '/video/play', // 视频播放量+1
  videoCollect: lqsyBaseDomain + '/video/collect', // 视频的收藏或者取消收藏
  wordsAll: lqsyBaseDomain + '/words/all', // 碑帖分类下的全部作品
  wordsDes: lqsyBaseDomain + '/words/des', // 获取碑帖的介绍
  wordsSection: lqsyBaseDomain + '/words/section', // 获取具体作品的切割为一幅一幅的图片
  wordsPiece: lqsyBaseDomain + '/words/piece', // 分页获取作品下每个切割好的单独字体
  wordsCollect: lqsyBaseDomain + '/words/collect', // 碑帖的具体作品的收藏与删除收藏
  wordsDiscuss: lqsyBaseDomain + '/words/discuss', // 具体作品下的评论获取
  wordsDiscussSub: lqsyBaseDomain + '/words/discuss-sub', // 插入一条碑帖评论
  wordsDiscussStar: lqsyBaseDomain + '/words/discuss-star', // 碑帖评论点赞或者取消点赞
  commonImg: lqsyBaseDomain + '/common/img', // 碑帖评论点赞或者取消点赞
  dictionaryCategory: lqsyBaseDomain + '/dictionary/category', // 碑帖评论点赞或者取消点赞
  dictionarySearch: lqsyBaseDomain + '/dictionary/search', // 碑帖评论点赞或者取消点赞
  wordsCategory: lqsyBaseDomain + '/words/category' // 碑帖分类
};
module.exports = serviceUrl;
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