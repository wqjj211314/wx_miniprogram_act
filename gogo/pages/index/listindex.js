// pages/index/listindex.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_list:[],
    hosturl:app.globalData.hosturl,
    share_use_id:"",
    search_word:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.get_activity_list();
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


  get_activity_list(){
    var _that = this;
    wx.showLoading({
      title: '...',
    })
    wx.request({
      url: app.globalData.hosturl + 'get_activity_list', //仅为示例，并非真实的接口地址
      data: {
        "user_id":app.globalData.login_userInfo["user_id"],
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        var list = [];
        console.log("获取list");
        console.log(res.data);
        res.data.forEach(element => {
          console.log(element.activity_id)
          list.push(element);
        });
        _that.setData({
          activity_list: list,
        })
        
        wx.hideLoading({
          success: (res) => {},
        });
      },
      fail(res){
        wx.hideLoading({
          success: (res) => {},
        });
        wx.showToast({
          title: '网络可能异常...',
          icon:"error",
          duration:4000
        })
  
      }
    });
  },
  navigateToactivityinfo(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var actinfo = this.data.activity_list[index];
    var activity_info = encodeURIComponent(JSON.stringify(this.data.activity_list[index]));
    console.log(actinfo)
    console.log(actinfo.createuser)
    let activity_user_info = encodeURIComponent(JSON.stringify(actinfo.createuser));
    wx.navigateTo({
      url: '../activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info+"&share_use_id="+this.data.share_use_id
    })
  },
  searchword(e){
    console.log(e.detail.value.trim())
    this.setData({
      search_word: e.detail.value.trim()
    });
  },
  search_activity_list(){
    if(this.data.search_word == ""){
      wx.showToast({
        title: '请输入搜索词',
        icon:"error"
      })
      return;
    }
    wx.showLoading({
      title: '搜索中...',
    })
    var _that = this;
    wx.request({
      url: app.globalData.hosturl + 'search_activity_list', //仅为示例，并非真实的接口地址
      data: {
        "user_id":app.globalData.login_userInfo["user_id"],
        "search_word":this.data.search_word,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        var list = [];
        console.log("获取list");
        console.log(res.data);
        res.data.forEach(element => {
          console.log(element.activity_id)
          list.push(element);
        });
        if(list.length == 0){
          wx.showToast({
            title: '搜索为空',
            icon:"error",
            duration:3000
          })
        }else{
          _that.setData({
            activity_list: list,
          })
        }
        
        
        wx.hideLoading({
          success: (res) => {},
        });
      },
      fail(res){
        wx.hideLoading({
          success: (res) => {},
        });
        wx.showToast({
          title: '网络可能异常...',
          icon:"error",
          duration:4000
        })
  
      }
    });
  },
  onTabItemTap(item) {
    console.log(item.index)//0
    console.log(item.pagePath)//pages/index/index
    console.log(item.text)//首页
    if(item.pagePath == app.globalData.tab_page_path){
      this.get_activity_list();
    }
    app.globalData.tab_page_path = item.pagePath;
  },
})