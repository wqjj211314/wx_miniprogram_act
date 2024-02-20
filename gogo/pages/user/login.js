// pages/user/login2.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {
      user_id:"",
      avatarUrl: defaultAvatarUrl,
      nickName: '',
      gender:-1
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  onChooseAvatar:function(e){
    console.log(e);
    var avatarUrl = e.detail.avatarUrl;
    var userInfo = this.data.userInfo;
    userInfo["avatarUrl"] = avatarUrl;
    var nickName = this.data.userInfo.nickName;
    var gender = this.data.userInfo.gender;
    this.setData({
      userInfo:userInfo,
      hasUserInfo: nickName && gender!=-1 && avatarUrl && avatarUrl !== defaultAvatarUrl,
    });
    wx.uploadFile({
      url: app.globalData.hosturl + 'upload_avatar_url', //接口
      filePath: avatarUrl,
      name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
      formData: {
        'user_id': userInfo["user_id"]
      },
      success: function (res) {
        
      },
      fail: function (error) {
        console.log(error);
      }
    });

  },
  listenRadioChange:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const nickName = this.data.userInfo.nickName;
    var avatarUrl = this.data.userInfo.avatarUrl;
    var gender = e.detail.value;
    this.setData({
      "userInfo.gender":  gender,
      hasUserInfo: nickName && gender!=-1 && avatarUrl && avatarUrl !== defaultAvatarUrl,
    });
  },
  onInputChange: function (e) {
    const nickName = e.detail.value;
    var avatarUrl = this.data.userInfo.avatarUrl;
    var gender = this.data.userInfo.gender;

    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && gender!=-1 && avatarUrl && avatarUrl !== defaultAvatarUrl,
    });
  },
  submit_userinfo:function(){
    var that = this;

    wx.request({
      url: app.globalData.hosturl + 'update_user_info',
      data: {
        "user_id":that.data.userInfo["user_id"],
        "nickName":that.data.userInfo["nickName"],
        "avatarUrl":that.data.userInfo["avatarUrl"],
        "gender":that.data.userInfo["gender"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data){
          console.log("成功改了昵称");
          that.setData({
            userInfo:res.data,
            modalName: ""
          });
          app.globalData.login_userInfo = res.data;
          wx.navigateTo({
            url: '../user/user'
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = JSON.parse(decodeURIComponent(options.userInfo))
    if(userInfo.avatarUrl == ""){
      userInfo.avatarUrl = defaultAvatarUrl;
    }
    this.setData({userInfo:userInfo})
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})