// pages/friend.js
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_list:[],
    url:"pages/friend/friend",
    triggered:false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("用户页 user onLoad");
    var url = util.getCurrentPageUrl();
    console.log(url);
    this.setData({url})
    app.globalData.friend_chat_msg_display = false;
    this.init_friend_chat_list();
  },
  onScrollRefresh(){
    console.log("下拉刷新")
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false,
      })
    }, 2000);
    this.init_friend_chat_list();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.hideTabBarRedDot({
      index: 3,
    });
    //if(!util.check_login(app)){
      //return;
    //}
  },
  navigateToActivity() {
    wx.navigateTo({
      url: '../activity/activity'
    })
  },
  navigateToindex() {
    wx.navigateTo({
      url: '../index/newindex'
    })
  },
  navigateTouser() {
    if(!util.check_login(app)){
      return;
    }else{
      wx.navigateTo({
        url: '../user/user'
      })
    }

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  
  onTabItemTap(item) {
    console.log(item.index)//0
    console.log(item.pagePath)//pages/index/index
    console.log(item.text)//首页
    app.globalData.tab_page_path = item.pagePath;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  init_friend_chat_list(){
    var _this = this;
    wx.request({
      url: app.globalData.hosturl+'get_friend_chat_list', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        /**
          [{
            'user_id_1': {
              'user_id': 'growthwang2',
              'nickName': 'growthwang2',
              'avatarUrl': ''
            },
            'user_id_2': {
              'user_id': 'androidtesterid',
              'nickName': 'androidtesterid',
              'avatarUrl': ''
            },
            'friend_nickName': 'growthwang2',
            'friend_avatarUrl': '',
            'chatmsg': '121',
            'msgtime': '2022-06-19 20:48:30'
          }, 
          {
            'user_id_1': {
              'user_id': 'growthwang2',
              'nickName': 'growthwang2',
              'avatarUrl': ''
            },
            'user_id_2': {
              'user_id': 'androidtesterid2',
              'nickName': 'androidtester2',
              'avatarUrl': ''
            },
            'friend_nickName': 'growthwang2',
            'friend_avatarUrl': '',
            'chatmsg': 'growthwang msg',
            'msgtime': '2022-06-18 13:51:27'
          }]
         */
        var list = [];//_this.data.session_list;
        console.log("获取list");
        console.log(res.data);
        res.data.forEach(element => {
          console.log(element.chatmsg)
          list.push(element);
        });
        _this.setData({
          session_list:list
        });
        if(res.data.length == 0){
          wx.showToast({
            title: '没有消息哦',
            icon:"success",
            duration:3000
          })
        }
        
      }
    });
  },
  navigateToChat(e){
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var friend_item = this.data.session_list[index];
    let friend_user_info = {};
    if(friend_item["user_id_1"]["user_id"] == app.globalData.login_userInfo["user_id"]){
      friend_user_info = encodeURIComponent(JSON.stringify(friend_item["user_id_2"]));
    }else{
      friend_user_info = encodeURIComponent(JSON.stringify(friend_item["user_id_1"]));
    }
    wx.navigateTo({
      url: '../chat/chat?friend_user_info=' + friend_user_info,
    });
  },

})