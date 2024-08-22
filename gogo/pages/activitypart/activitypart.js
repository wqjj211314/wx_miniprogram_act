// pages/activitycreate/activitycreate.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_part_list:[],
    hosturl:app.globalData.hosturl,
    is_login_user:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据获取中...',
    });
    this.setData({
      user_id:options.user_id
    })
    if(app.globalData.login_userInfo["user_id" == options.user_id]){
      this.setData({
        is_login_user:true
      })
    }
    this.navigateToActivityadd(options.user_id);
  },
  navigateToActivityadd(user_id){
    var that = this;
    wx.request({
      url: app.globalData.hosturl+'get_partactlist', //仅为示例，并非真实的接口地址
      data: {
        "user_id":user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {},
          });
        },3000)
        if(res.data.length>=0){
          console.log("参与的活动")
          console.log(JSON.stringify(res.data))
          //JSON.stringify(this.data.activity_info);
          that.setData({
            activity_part_list:res.data
          })
          if(res.data.length == 0){
            wx.showToast({
              title: '还没有参与活动',
              icon:"success",
              duration:2500
            })
          }
        }
        
      }
    });
  },
  navigateToActivityIndex(e){
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_part_list.length);
    var index_activity = this.data.activity_part_list[index];
    app.globalData.current_activity_id = index_activity.activity_id;
    wx.switchTab({
      url: '../index/index'
    })
  },
  navigateToActivityInfo(e){
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_part_list.length);
    var activity_info = this.data.activity_part_list[index];
    let activity_user_info = encodeURIComponent(JSON.stringify(activity_info.createuser));
    activity_info = encodeURIComponent(JSON.stringify(activity_info));
    console.log("跳转至活动报名界面")
    console.log(activity_info);
    console.log(activity_user_info)
    wx.navigateTo({
      url: '../activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info
    })
    
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

  }
})