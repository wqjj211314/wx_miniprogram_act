// pages/index/listindex.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    activity_list:[],
    search_tip:"搜索相关活动",
    hosturl:app.globalData.hosturl,
    share_use_id:"",
    search_word:"",
    current_swiper_item_index:1,
    good_list:[],
    admin_flag:false,
    triggered:false,
    index_bar_bg:""
  },
 
  onShareAppMessage: function () {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.get_activity_list();
    this.get_index_bar_bg();
    if(app.globalData.login_userInfo["checking_flag"]){
      this.setData({
        admin_flag:true
      })
    }
    
    
  },
  navigateToGood(){
    wx.navigateTo({
      url: '/pages/good/goodindex',
    })
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
    if (typeof this.getTabBar === 'function' ) {
      this.getTabBar((tabBar) => {
        tabBar.setData({
          selected: 0
        })
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


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  navigateToplace(){
    wx.navigateTo({
      url: 'place',
    })
  },
  navigateToGoodindex(){
    wx.navigateTo({
      url: '/pages/good/goodindex',
    })
  },
  navigateToActivitypart() {
    wx.navigateTo({
      url: '/pages/activitypart/activitypart?user_id='+app.globalData.login_userInfo.user_id
    })
  },
  navigateToFollowUser(){
    wx.navigateTo({
      url: '/pages/user/followuser'
    })
  },
  get_activity_list(){
    var _that = this;
    wx.showLoading({
      title: '加载中',
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
        
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {},
          });
        },3000)
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

  navigateTomini(e){
    var url = e.currentTarget.dataset.url;
    console.log(url)
    wx.navigateToMiniProgram({
      shortLink: url,
      success(res) {
        // 打开成功
        wx.showToast({
          title: '打开成功',
        })
      },
      fail(res) {
        // 打开失败
        console.log(res)
        wx.showToast({
          title: '打开失败',
        })
      },
    })
  },
  searchword(e){
    console.log(e.detail.value.trim())
    this.setData({
      search_word: e.detail.value.trim()
    });
  },
  search_main(){
    this.search_activity_list()
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
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {},
          });
        },3000)
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
  get_index_bar_bg(){
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_index_bar_bg', //仅为示例，并非真实的接口地址
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data != ""){
          that.setData({
            index_bar_bg:res.data
          })
        }
      },
      fail(res){
       
  
      }
    });
  },
  onTabItemTap(item) {
    console.log(item.index)//0
    console.log(item.pagePath)//pages/index/index
    console.log(item.text)//首页
    if(item.pagePath == app.globalData.tab_page_path){
      this.get_activity_list();
      this.get_goods()
    }
    app.globalData.tab_page_path = item.pagePath;
  },
  onScrollRefresh(){
    console.log("下拉刷新" + this.data.triggered)
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false
      })
    }, 2000);
    this.get_activity_list()
  },
})