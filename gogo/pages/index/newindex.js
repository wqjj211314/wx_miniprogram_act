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
    index_bar_bg:"",
    recommend_good_list:[],
    latitude: "",
              longitude: ""
  },
 
  onShareAppMessage: function () {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.get_activity_list();
    this.get_index_bar_bg();
    this.get_recommend_good_list();
    if(app.globalData.login_userInfo["checking_flag"]){
      this.setData({
        admin_flag:true
      })
    }
    this.again_getLocation();
    
    
  },
  navigateTogoodinfo(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var goodinfo = this.data.recommend_good_list[index];
    var good_info = encodeURIComponent(JSON.stringify(this.data.recommend_good_list[index]));
    console.log(goodinfo)
    wx.navigateTo({
      url: '../good/gooddetail?good_info=' + good_info
    })
  },
  navigateToGood(){
    wx.navigateTo({
      url: '/pages/good/goodindex',
    })
  },
  get_recommend_good_list() {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_recommend_good_list',
      data: {
        "user_id": app.globalData.login_userInfo["user_id"]
      },
      success: (res) => {
        console.log("获取用户信息")
        if (res.data.code == 200) {
          that.setData({
            recommend_good_list: res.data.result
          })
        }
      }
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
  getLocation(that) {
    var that = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        wx.getLocation({
          type: 'wgs84',
          success (res) {
            const latitude = res.latitude
            const longitude = res.longitude
           
            that.setData({
              latitude: latitude,
              longitude: longitude
            }) 
           
          }
         })
         
      }
    });

  },
  again_getLocation: function () {
    let that = this;
    // 获取位置信息
    wx.getSetting({
      success: (res) => {
        console.log("位置信息" + res)
        console.log(res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function (res) {
              console.log(res)
              if (res.cancel) {
                wx.showToast({
                  title: '授权失败',
                  icon: 'success',
                  duration: 1000
                })
                
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    console.log(dataAu)
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                     
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          that.getLocation();

        }
        else { //授权后默认加载
          that.getLocation();
        }
      }
    })

  },
})