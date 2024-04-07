const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: ['留言,说下你对我羽毛球的评价'],
    hobby_list: [],
    user_id: "",
    reload_options: "",
    hosturl: app.globalData.hosturl,
    self_flag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //var user_id = JSON.parse(decodeURIComponent(options.user_id));
    var user_id = "";
    var that = this;
    if (options.hasOwnProperty("user_id")) {
      console.log("有user id"+options);
      console.log(options);
      user_id = options.user_id;
    }
    console.log(app.globalData.login_userInfo.user_id);
    if(user_id == app.globalData.login_userInfo.user_id){
      this.setData({
        self_flag:true 
      });
      
    }else{
      wx.showToast({
        title: "兴趣列表为空",
        icon: 'success',
        duration: 3000
      })
    }

    this.setData({
      user_id: user_id,
      reload_options: options
    });
    console.log("用户兴趣列表，user_id" + user_id);

    wx.request({
      url: app.globalData.hosturl + 'gethobbys', //仅为示例，并非真实的接口地址
      data: {
        "user_id": user_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("成功获取兴趣列表：" + res.data);
        var hobby_list = that.data.hobby_list;
        console.log("兴趣列表数量" + res.data.length);
        res.data.forEach(element => {
          console.log(element);
          hobby_list.push(element);
        });
        that.setData({
          hobby_list: hobby_list
        })


      },
      fail: function (error) {
        wx.hideLoading();
        wx.showToast({
          title: '获取兴趣列表失败',
          icon: 'error',
          duration: 3000
        })
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

  },
  add_hobby() {
    wx.navigateTo({
      url: '../hobby/addhobby?user_id='+this.data.user_id
    })
  },
  edit_hobby_info(e) {
    var index = e.currentTarget.dataset.index;
    console.log(typeof (index));
    var edit_hobby_info = this.data.hobby_list[index];
    console.log(edit_hobby_info);
    edit_hobby_info = encodeURIComponent(JSON.stringify(edit_hobby_info));

    wx.navigateTo({
      url: '../hobby/edithobby?hobby_info=' + edit_hobby_info,
    });
  },
  delete_hobby(e) {
    var that = this;
    wx.showModal({
      title: '删除兴趣',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          
          var index = e.currentTarget.dataset.index;
          console.log(typeof (index));
          var hobby_info = that.data.hobby_list[index];
          wx.request({
            url: app.globalData.hosturl + 'delete_hobby', //仅为示例，并非真实的接口地址
            data: {
              "user_id": hobby_info.user_id,
              "hobby_tag": hobby_info.hobby_tag,

            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {

              console.log("成功获取兴趣列表：" + res.data);
              var hobby_list = [];
              console.log("兴趣列表数量" + res.data.length);
              res.data.forEach(element => {
                console.log(element);
                hobby_list.push(element);
              });
              that.setData({
                hobby_list: hobby_list
              })
            },
            fail: function (error) {
              wx.hideLoading();
              wx.showToast({
                title: '删除失败',
                icon: 'error',
                duration: 3000
              })
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})