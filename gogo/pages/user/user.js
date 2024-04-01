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
    url:"pages/user/user"

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
  navigateToActivity() {
    wx.navigateTo({
      url: '../activity/activity'
    })
  },
  navigateToMoney() {
    wx.navigateTo({
      url: 'money'
    })
  },
  navigateToActivitycreate() {
    wx.navigateTo({
      url: '../activitycreate/activitycreate'
    })

  },
  navigateToActivityadd() {
    wx.navigateTo({
      url: '../activitypart/activitypart'
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
      
      friend_chat_msg_display:app.globalData.friend_chat_msg_display
    });
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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