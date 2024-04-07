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
      gender:-1,
      signature:"个性签名"
    },
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  onChooseAvatar:function(e){
    console.log(e);
    var avatarUrl = e.detail.avatarUrl;
    var userInfo = this.data.userInfo;
    userInfo["avatarUrl"] = avatarUrl;
    this.setData({
      userInfo:userInfo
    });
    wx.uploadFile({
      url: app.globalData.hosturl + 'upload_avatar_url', //接口
      filePath: avatarUrl,
      name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
      formData: {
        'user_id': app.globalData.login_userInfo["user_id"]
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
    var gender = e.detail.value;
    this.setData({
      "userInfo.gender":  gender
    });
  },
  onsignatureChange:function(e){
    const signature = e.detail.value;
    if(signature == ""){
      wx.showToast({
        title: '请填写个性签名',
      })
      return;
    }
    //去除表情的特殊字符
    /*
    var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
    if(signature.match(regRule)){
      console.log("有表情")
      signature = signature.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
      console.log(signature)
    }
    */
    this.setData({
      "userInfo.signature": signature
    });
  },
  onInputChange: function (e) {
    const nickName = e.detail.value;
    if(nickName == ""||nickName == "匿名"){
      wx.showToast({
        title: '请填写合法昵称',
      })
      return;
    }
    //去除表情的特殊字符
    /*
    var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
    if(nickName.match(regRule)){
      console.log("有表情")
      nickName = nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
      console.log(nickName)
    }
    */

    this.setData({
      "userInfo.nickName": nickName
    });
  },
  submit_userinfo:function(){
    console.log(this.data.userInfo["avatarUrl"])
    var that = this;
    //重新登录获取openid
    //然后修改个人信息
     //上传头像
     wx.uploadFile({
      url: app.globalData.hosturl + 'upload_avatar_url', //接口
      filePath: that.data.userInfo["avatarUrl"],
      name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
      formData: {
        'user_id': app.globalData.login_userInfo["user_id"],
      },
      success: function (res) {
      },
      fail: function (error) {
        console.log(error);
      }
    });
    //修改个人信息
    wx.request({
      url: app.globalData.hosturl + 'update_user_info',
      data: {
        "user_id":app.globalData.login_userInfo["user_id"],
        "nickName":that.data.userInfo["nickName"],
        "avatarUrl":"",
        "gender":that.data.userInfo["gender"],
        "signature":that.data.userInfo["signature"]
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
          try {
            wx.setStorageSync('openid', res.data.openid);
          } catch (e) { }
          wx.switchTab({
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
    if(options.hasOwnProperty("userInfo")){
      let userInfo = JSON.parse(decodeURIComponent(options.userInfo))
      if(userInfo.avatarUrl == ""){
        userInfo.avatarUrl = defaultAvatarUrl;
      }
      this.setData({userInfo:userInfo})
    }
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.hosturl + 'getopenid',
            data: {
              code: res.code
            },
            success: (res) => {
              console.log("appjs用户openid");
              console.log(res.data);
              console.log(res.data.openid);
              app.globalData.login_userInfo["user_id"] = res.data.openid;
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    
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