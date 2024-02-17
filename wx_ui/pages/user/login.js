// pages/user/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  modify_user_info:function(e){
    console.log(e);
    var avatarUrl = e.detail.avatarUrl;
    var userinfo = this.data.userinfo;
    userinfo["avatarUrl"] = avatarUrl;
    this.setData({
      userinfo
    });
    wx.uploadFile({
      url: app.globalData.hosturl + 'upload_avatar_url', //接口
      filePath: avatarUrl,
      name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
      formData: {
        'user_id': userinfo["user_id"]
      },
      success: function (res) {
        
      },
      fail: function (error) {
        console.log(error);
      }
    });

  },
  inputMsg: function (e) {
    this.setData({
      new_nickName: e.detail.value
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