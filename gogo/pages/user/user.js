// pages/user/user.js
//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismask: 'block',
    checking_flag: false,
    userinfo: {},
    t_length: 0,
    new_nickName:"",
    friend_chat_msg_display:false,
    url:"pages/user/user",
    triggered: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //let user_info = JSON.parse(decodeURIComponent(options.userinfo))
    console.log("用户页 user onLoad");
    var url = util.getCurrentPageUrl();
    console.log(url);
    
    this.setData({
      url:url,
      userinfo: app.globalData.login_userInfo,
      checking_flag: app.globalData.checking_flag,
      friend_chat_msg_display:app.globalData.friend_chat_msg_display
    });
  },
  bindText: function (e) {
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      t_length: t_text
    })
  },
  modify_user_info:function(e){
    wx.navigateTo({
      url: 'login?userInfo='+encodeURIComponent(JSON.stringify(this.data.userinfo))
    })
    return;

  },
  new_nickName:function(){
    this.setData({
      modalName: "new_nickName_modal"
    });
  },
  submit_new_nickName:function(){
    var that = this;
    if(this.data.new_nickName.trim() == "" || this.data.new_nickName.trim() == this.data.userinfo["nickName"]){
      wx.showToast({
        title: '请修改昵称，填写信息有误！',
        icon:"none"
      });
      return;
    }
    wx.request({
      url: app.globalData.hosturl + 'update_user_info',
      data: {
        "user_id":this.data.userinfo["user_id"],
        "nickName":this.data.new_nickName,
        "avatarUrl":"",
        "gender":-1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data){
          console.log("成功改了昵称");
          that.setData({
            userinfo:res.data,
            modalName: ""
          });
          app.globalData.login_userInfo = res.data;
        }
      }
    });
  },
  inputMsg: function (e) {
    this.setData({
      new_nickName: e.detail.value
    });
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  navigateToallorder(){
    wx.navigateTo({
      url: '../good/order?deliver_status='+"",
    })
  },
  navigateTocancelorder(){
    wx.navigateTo({
      url: '../good/order?deliver_status='+"申请退款",
    })
  },
  navigateToordernotdeliver(){
    wx.navigateTo({
      url: '../good/order?deliver_status='+"7天内发货",
    })
  },
  navigateToActivity() {
    wx.navigateTo({
      url: '../activity/activity'
    })
  },
  navigateToFollowUser(){
    wx.navigateTo({
      url: 'followuser'
    })
  },
  navigateToMoney() {
    wx.navigateTo({
      url: 'money'
    })
  },
  navigateToActivitycreate() {
    wx.navigateTo({
      url: '../activitycreate/activitycreate?user_id='+this.data.userinfo.user_id
    })

  },
  navigateToActivitypart() {
    wx.navigateTo({
      url: '../activitypart/activitypart?user_id='+this.data.userinfo.user_id
    })
  },
  navigateToActivitychecking() {
    wx.navigateTo({
      url: '../activitycheck/activitycheck'
    })
  },
  navigateToindex() {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  navigateToFriendList() {
    wx.navigateTo({
      url: '../friend/friend'
    })
  },
  navigateTohobbylist() {
    console.log(this.data.userinfo);
    wx.navigateTo({
      url: '../hobby/hobbylist?user_id='+this.data.userinfo.user_id
    })
  },
  chat_with_dev() {
    wx.request({
      url: app.globalData.hosturl + 'get_customer_service',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let customer_service = encodeURIComponent(JSON.stringify(res.data));
        console.log(customer_service);
        wx.navigateTo({
          url: '../chat/chat?friend_user_info=' + customer_service,
        });
      }
    });

  },
  click_setting() {
    wx.showToast({
      title: '暂未开放',
      icon: "none",
      duration: 2000
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("用户页 user onShow");
    this.setData({
      friend_chat_msg_display:app.globalData.friend_chat_msg_display,
      userinfo:app.globalData.login_userInfo
    });
    this.getuserinfo();
  },
  copy_weixin(){
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onScrollRefresh:function(){
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false,
      })
    }, 2000);
    this.getuserinfo()
  },
  getuserinfo(){
    try {
      console.log("用户登录");
      //直接获取缓存保存的
      var openid = wx.getStorageSync('openid');
      console.log(openid)
      var that = this;
      if (openid == "" || openid == undefined) {
        console.log("需要登录获取openid")
        this.user_login();
      }else{
        //发起网络请求
        wx.request({
          url: app.globalData.hosturl + 'get_userinfo',
          data: {
            "user_id": openid
          },
          success: (res) => {
            console.log("获取用户信息")
            console.log(res.data)
            app.globalData.openid = res.data.user_id;
            app.globalData.checking_flag = res.data.checking_flag;
            app.globalData.login_userInfo = res.data;
            app.globalData.hasUserInfo = true;
            that.setData({
              userinfo: res.data,
              checking_flag: res.data.checking_flag,
            });
          }
        })
      }
    } catch (e) {
      console.log("持久化登录信息获取失败");
      console.log(e);
    }
  },

  user_login() {
    //return;
    var that = this;
    wx.login({
      success(res) {
        console.log("登录授权结果")
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.hosturl + 'getopenid',
            data: {
              code: res.code
            },
            success: (res) => {
             
              app.globalData.openid = res.data.openid;
              app.globalData.checking_flag = res.data.checking_flag;
              app.globalData.login_userInfo["user_id"] = res.data.openid;
              app.globalData.login_userInfo["nickName"] = res.data.nickName;
              app.globalData.login_userInfo["avatarUrl"] = res.data.avatarUrl;
              app.globalData.login_userInfo["gender"] = res.data.gender;
              app.globalData.login_userInfo["signature"] = res.data.signature;
              that.setData({
                userinfo: res.data,
                checking_flag: res.data.checking_flag,
              });
              try {
                wx.setStorageSync('openid', res.data.openid);
                app.globalData.hasUserInfo = true;
                //wx.setStorageSync('nickName', res.data.nickName);
              } catch (e) { }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail(res){
        console.log("登录失败")
      },
      complete(res){
        console.log("登录完成")
        console.log(res)
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onTabItemTap(item) {
    console.log(item.index)//0
    console.log(item.pagePath)//pages/index/index
    console.log(item.text)//首页
    app.globalData.tab_page_path = item.pagePath;
  },
})