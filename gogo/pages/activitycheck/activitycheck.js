// pages/activitycreate/activitycreate.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_create_list: [],
    hosturl: app.globalData.hosturl,
    imgs: [],
    expanding_money_record_list: [],
    order_list: [],
    input_value: ""
  },
  get_all_order() {
    var that = this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.hosturl + 'query_all_order', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.result.length >= 0) {
          console.log("待审核的活动")
          //console.log(JSON.stringify(res.data))
          //JSON.stringify(this.data.activity_info);
          that.setData({
            order_list: res.data.result
          });
          if (res.data.length == 0) {
            wx.showToast({
              title: '没有订单',
              icon: 'success',
              duration: 2000
            })
          }

        }

      }
    });
    setTimeout(() => {
      wx.hideLoading()
    }, 3000);
  },
  del_order(e) {
    var that = this;

    var index = e.currentTarget.dataset.index;
    console.log(index)
    var order = this.data.order_list[index];
    console.log(order)
    wx.request({
      url: app.globalData.hosturl + 'delete_order', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "order_id": order.order_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        that.get_all_order()
      },
      fail: function (error) {
        wx.hideLoading();
      }
    })
  },
  refund_order(e) {
    var that = this;

    var index = e.currentTarget.dataset.index;
    console.log(index)
    var order = this.data.order_list[index];
    console.log(order)
    wx.request({
      url: app.globalData.hosturl + 'refund_order', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "order_id": order.order_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        that.get_all_order()
      },
      fail: function (error) {
        wx.hideLoading();
      }
    })
  },
  inputMsg(e) {
    this.setData({
      input_value: e.detail.value
    });
  },
  update_order_deliver_status(e) {
    var that = this;

    var index = e.currentTarget.dataset.index;
    console.log(index)
    var order = this.data.order_list[index];
    console.log(order)
    wx.request({
      url: app.globalData.hosturl + 'update_order_deliver_status', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "order_id": order.order_id,
        "deliver_status": this.data.input_value
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        that.get_all_order()
      },
      fail: function (error) {
        wx.hideLoading();
      }
    })
  },
  check_pay_price() {
    var price = Math.abs(parseFloat(this.data.input_value)).toFixed(2);
    //price = parseFloat(this.data.pay_price).toFixed(2);
    console.log(typeof (price))
    console.log(price)
    if (price == "NaN"||price <= 0) {
      wx.showToast({
        title: '金额有误',
        icon: "error",
        duration: 3000
      })
      
      return false;
    } else {
      
      this.setData({
        input_value: price
      })
      return true;
    }
  },
  update_order_price(e) {
    if(!this.check_pay_price()){
      return;
    }
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var order = this.data.order_list[index];
    console.log(order)
    wx.showModal({
      title: '改价：' + this.data.input_value,
      content: '原价' + order.pay_price/100 + "元,现价" + this.data.input_value+'元',
      complete: (res) => {
        if (res.cancel) {
          return;
        }

        if (res.confirm) {

          wx.request({
            url: app.globalData.hosturl + 'update_order_price', //仅为示例，并非真实的接口地址
            data: {
              "user_id": app.globalData.login_userInfo["user_id"],
              "order_id": order.order_id,
              "pay_price": this.data.input_value*100
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              wx.hideLoading();
              that.get_all_order()
            },
            fail: function (error) {
              wx.hideLoading();
            }
          })
        }
      }
    })

  },
  get_checking_activity_list() {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_checking_activity_list', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.length >= 0) {
          console.log("待审核的活动")
          //console.log(JSON.stringify(res.data))
          //JSON.stringify(this.data.activity_info);
          that.setData({
            activity_create_list: res.data
          });
          if (res.data.length == 0) {
            wx.showToast({
              title: '活动都已审核',
              icon: 'success',
              duration: 2000
            })
          }

        }

      }
    });
  },
  get_all_img() {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_all_img', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.length > 0) {

          that.setData({
            imgs: res.data
          });


        }

      }
    });
  },
  get_expanding_money_record() {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_expanding_money_record', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {

          that.setData({
            expanding_money_record_list: res.data.result
          });
        }
      }
    });
  },
  confirm_expanding_money(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var info = this.data.expanding_money_record_list[index]
    wx.request({
      url: app.globalData.hosturl + 'confirm_expanding_money', //仅为示例，并非真实的接口地址
      data: {
        "id": id,
        "expand_user_id": info.user_id,
        "admin_user_id": app.globalData.login_userInfo["user_id"],
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.showToast({
          title: res.data.result,
          icon: 'none',
          duration: 3000
        })
        that.get_expanding_money_record();
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_checking_activity_list();
    this.get_all_img();
    this.get_expanding_money_record();
    this.get_all_order();
  },
  ViewImagebg(e) {
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
      current: e.currentTarget.dataset.url
    });
  },
  delete_img(e) {
    var img_path = e.currentTarget.dataset.url;
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'delete_img', //仅为示例，并非真实的接口地址
      data: {
        "img_path": img_path
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {



      }
    });
  },
  update_activity_bg_issue(e) {
    var activity_id = e.currentTarget.dataset.id;
    this.update_activity_status(activity_id, 201, "已审核，图片敏感");
    //this.get_checking_activity_list();
  },
  update_activity_pass(e) {
    var activity_id = e.currentTarget.dataset.id;
    this.update_activity_status(activity_id, 200, "已审核，正常");
    //this.get_checking_activity_list();
  },
  update_activity_invalid(e) {
    var activity_id = e.currentTarget.dataset.id;
    this.update_activity_status(activity_id, 101, "活动违规");
    //this.get_checking_activity_list();
  },
  update_activity_status(activity_id, activity_status, activity_status_comment) {
    console.log(activity_status)
    console.log(activity_status_comment)
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'update_activity_status', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "user_id": app.globalData.login_userInfo["user_id"],
        "activity_status": activity_status,
        "activity_status_comment": activity_status_comment
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.showToast({
          title: res.data.result,
          icon: 'none',
          duration: 3000
        })
        that.get_checking_activity_list();

      }
    });
  },
  calculate_close_all_activity() {
    wx.showLoading({
      title: '结算中...',
    })
    wx.request({
      url: app.globalData.hosturl + 'calculate_close_all_activity', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.result,
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: '服务器异常',
            icon: 'none',
            duration: 3000
          })
        }
        wx.hideLoading()

      }
    });
  },
  delete_all_activity_queue_member() {
    wx.showLoading({
      title: '结算中...',
    })
    wx.request({
      url: app.globalData.hosturl + 'delete_all_activity_queue_member', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.result,
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: '服务器异常',
            icon: 'none',
            duration: 3000
          })
        }
        wx.hideLoading()

      }
    });
  },
  calculate_all_share_order() {
    wx.showLoading({
      title: '结算中...',
    })
    wx.request({
      url: app.globalData.hosturl + 'confirm_share_order', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.result,
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: '服务器异常',
            icon: 'none',
            duration: 3000
          })
        }
        wx.hideLoading()

      }
    });
  },
  navigateToActivityInfo(e) {
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