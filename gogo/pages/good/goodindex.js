// pages/index/listindex.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_list:[],
    search_tip:"搜索商品",
    hosturl:app.globalData.hosturl,
    share_use_id:"",
    search_word:"",
    current_swiper_item_index:1,
    good_list:[],
    admin_flag:false,
    triggered:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    if(app.globalData.login_userInfo["checking_flag"]){
      this.setData({
        admin_flag:true
      })
    }
    this.get_goods()
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  navigateToplace(){
    wx.navigateTo({
      url: 'place',
    })
  },
  navigateToclub(){
    wx.navigateTo({
      url:'club',
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
  navigateToshareorder(){
    wx.navigateTo({
      url: '../good/shareorder',
    })
  },
 

  get_goods(){
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_all_good', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"], 
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("成功创建活动：" + res.data);
        let result = res.data;
        if (result["code"] == 200) {
          var good_list = [];
          that.setData({
            good_list:good_list.concat(result["result"])
          })
        }else{
          wx.showToast({
            title: result["result"],
            icon: "error",
            duration: 3000
          });
        }
        wx.hideLoading();
       
      },
      fail: function (error) {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          icon: 'error',
          duration: 3000
        })
      }
    });
  },
 
  navigateTogoodinfo(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var goodinfo = this.data.good_list[index];
    var good_info = encodeURIComponent(JSON.stringify(this.data.good_list[index]));
    console.log(goodinfo)
    wx.navigateTo({
      url: '../good/gooddetail?good_info=' + good_info
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
    this.search_good()
    
  },
  search_good(search_word){
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
      url: app.globalData.hosturl + 'search_good', //仅为示例，并非真实的接口地址
      data: {
        "user_id":app.globalData.login_userInfo["user_id"],
        "search_word":this.data.search_word,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        
        console.log(res.data);
       
        if(res.data.result.length == 0){
          wx.showToast({
            title: '搜索为空',
            icon:"error",
            duration:3000
          })
        }else{
          _that.setData({
            good_list: res.data.result,
          })
        }
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {},
          });
        },2000)
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
  onScrollRefresh(){
    console.log("下拉刷新" + this.data.triggered)
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false
      })
    }, 2000);
    this.get_goods()
  },

  add_good(){
    wx.navigateTo({
      url:"/pages/good/addgood"
    })
  }
})