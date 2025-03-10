// pages/activitycreate/activitycreate.js
const app = getApp();
const manage_activity = require("../activityshowinfo/manage_activity.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_create_list: [],
    hosturl: app.globalData.hosturl,
    is_login_user:false,
    club_name_club_place_list:[],
    search_word:"",
    sel_activity_index_list:[]
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
    if(app.globalData.login_userInfo["user_id"] == options.user_id){
      this.setData({
        is_login_user:true
      })
    }
    this.navigateToActivitycreate(options.user_id);
  },
  search_club_name_club_place_list(e){
    this.setData({
      search_word: e.currentTarget.dataset.search
    })
  },
  navigateToActivitycreate(user_id=app.globalData.login_userInfo["user_id"]) {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_create_actlist', //仅为示例，并非真实的接口地址
      data: {
        "user_id": user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        if (res.data.length >= 0) {
          console.log("创建的活动")
          //console.log(JSON.stringify(res.data))
          //JSON.stringify(this.data.activity_info);
          
          var club_name_club_place_list = [];
          res.data.forEach(item=>{
            if(item.club_name!=""&&club_name_club_place_list.indexOf(item.club_name)==-1){
              club_name_club_place_list.push(item.club_name)
            }
            
          })
          res.data.forEach(item=>{
           
            if(item.show_activityaddress!=""&&club_name_club_place_list.indexOf(item.show_activityaddress)==-1){
              club_name_club_place_list.push(item.show_activityaddress)
            }
          })
          that.setData({
            activity_create_list: res.data,
            club_name_club_place_list:club_name_club_place_list
          });
          if (res.data.length == 0) {
            wx.showToast({
              title: '还没创建活动哦',
              icon: "success",
              duration: 2500
            })
          }
        }

      }
    });

  },
  navigateToActivityIndex(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var activity_info = this.data.activity_create_list[index];
    app.globalData.current_activity_id = activity_info.activity_id;
    wx.switchTab({
      url: '../index/newindex'
    })
  },
  navigateToActivityInfo(e){
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var activity_info = this.data.activity_create_list[index];
    let activity_user_info = encodeURIComponent(JSON.stringify(activity_info.createuser));
    activity_info = encodeURIComponent(JSON.stringify(activity_info));
    console.log("跳转至活动报名界面")
    console.log(activity_info);
    console.log(activity_user_info)
    wx.navigateTo({
      url: '../activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info
    })
    
  },
  delete_activity(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var activity_info = this.data.activity_create_list[index];
    var activity_id = activity_info["activity_id"];
    wx.request({
      url: app.globalData.hosturl + 'delete_activity', //仅为示例，并非真实的接口地址
      data: {
        "user_id":app.globalData.login_userInfo["user_id"],
        "activity_id": activity_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        wx.showToast({
          title: res.data,
          icon: "none",
          duration: 2000
        })
        if (res.data == "成功删除活动") {
          that.navigateToActivitycreate();
        }

      }
    });

  },
  cancel_activity(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var activity_info = this.data.activity_create_list[index];
    var activity_id = activity_info["activity_id"];
    wx.request({
      url: app.globalData.hosturl + 'update_activity_status', //仅为示例，并非真实的接口地址
      data: {
        "user_id":app.globalData.login_userInfo["user_id"],
        "activity_id": activity_id,
        "activity_status": 801//取消活动
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.result);
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.result,
            icon: "none",
            duration: 2000
          })
          that.navigateToActivitycreate();
        }else{
          wx.showToast({
            title: res.data.result,
            icon: "none",
            duration: 2000
          })
        }

      }
    });
  },
  refund_all_member(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var activity_info = this.data.activity_create_list[index];
    var activity_id = activity_info["activity_id"];
    wx.request({
      url: app.globalData.hosturl + 'refund_all_member', //仅为示例，并非真实的接口地址
      data: {
        "user_id":app.globalData.login_userInfo["user_id"],
        "activity_id": activity_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.result);
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.result,
            icon: "none",
            duration: 2000
          })
          
        }else{
          wx.showToast({
            title: res.data.result,
            icon: "none",
            duration: 2000
          })
        }

      }
    });
  },
  update_activity_info(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var activity_info = this.data.activity_create_list[index];
    //跳转到更新activity的界面
    activity_info = encodeURIComponent(JSON.stringify(activity_info));
    wx.navigateTo({
      url: '../activity/editactivity?activity_info=' + activity_info
    })
  },
  calculate_close_activity(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var activity_info = this.data.activity_create_list[index];
    var activity_id = activity_info["activity_id"];
    if(new Date(activity_info["endtime"]) - new Date() > 0){
      wx.showToast({
        title: '活动还未结束',
        icon:'error',
        duration:3000
      })
      return;
    }
    wx.request({
      url: app.globalData.hosturl + 'calculate_close_activity', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "user_id":app.globalData.login_userInfo["user_id"],
        "hobby_tag":activity_info["activity_tag"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.result);
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.result,
            icon: "none",
            duration: 2000
          })
          that.navigateToActivitycreate();
        }else{
          wx.showToast({
            title: res.data.result,
            icon: "error",
            duration: 2000
          })
        }

      }
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
  generateScheme: function () {
    wx.showLoading({
      title: '处理中',
    })
    var sel_activity_index_list = this.data.sel_activity_index_list;
    var sel_activity_list = [];
    for(var index in sel_activity_index_list){
      var value = sel_activity_index_list[index];
      var activity_info = this.data.activity_create_list[value];
    
      var simple_activity_info = {};
      simple_activity_info["activity_id"] = activity_info["activity_id"]
      simple_activity_info["activity_tag"] = activity_info["activity_tag"]
    
      simple_activity_info = encodeURIComponent(JSON.stringify(simple_activity_info));
      sel_activity_list.push(simple_activity_info)
    }
    
    var that = this;
    wx.request({
      url: app.globalData.hosturl+"api_generate_scheme",
      method: 'POST',
      data: {
        "path": "pages/activityshowinfo/activityshowinfo",
        "sel_activity_list": sel_activity_list,
        "is_expire":false
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          var result = res.data.result;
          var copy_activity_text = "";
          for(var index in result){
            var activity_index = sel_activity_index_list[index]
            var activity_info = that.data.activity_create_list[activity_index]
            /**
             * errcode: 0
errmsg: "ok"
openlink: "weixin://dl/business/?t=0jeQ3n9Ih7n"
             */
            if(result[index]["errcode"] == 0){
              copy_activity_text = copy_activity_text + "🚩活动主题："+activity_info["title"] + "\n🚘活动地点："+activity_info["show_activityaddress"]+"\n🕓活动时间："+activity_info["activity_live"]+"\n💢报名链接："+result[index]["openlink"]+"\n\n"
            }
          }
          wx.setClipboardData({
            data: copy_activity_text,
            success (res) {
              wx.hideLoading()
              wx.showToast({
                title: '复制完成！',
                icon:'success',
                duration:3000
              })
            },
            fail(res){
              console.log(res)
            }
          })
          
        } else {
          wx.showToast({
            title: '生成失败：' + res.data.errmsg,
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '请求失败：' + err.errMsg,
          icon: 'none'
        });
      }
    });
  },
  listenCheckboxChange(e){
    console.log('当checkbox-group中的checkbox选中或者取消是我被调用');
      //打印对象包含的详细信息
      console.log(e.detail.value);
      var sel_values = e.detail.value;
      this.setData({
        sel_activity_index_list:sel_values
      })
      
  },
  copyFormattedContent: function () {
    wx.setClipboardData({
      data: 'data',
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      },
      fail(res){
        console.log(res)
      }
    })
    
  }
})