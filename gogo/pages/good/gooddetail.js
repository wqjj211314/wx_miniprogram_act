// pages/good/gooddetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good_info: {},
    admin_flag: false,
    sel_good_size: "",
    sel_good_type: "",
    sel_good_color: "",
    sel_good_amount: 0,
    sel_deliver: "",
    minusStatus: "disabled",
    address_list: [
    ],
    addressindex: -1,
    choose_selfget: false,
    order_amount_7day: 0,
    only_self_deliver: false,
    good_remark:"",
    share_user_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("gooddetail onload")
    let good_info = JSON.parse(decodeURIComponent(options.good_info));
    this.getuserinfo();
    if (app.globalData.login_userInfo["checking_flag"]) {
      this.setData({
        admin_flag: true
      })
    }
    if(options.hasOwnProperty("share_user_id")){
      console.log("分享人")
      this.setData({
        share_user_id: options.share_user_id
      })
    }
    this.setData({
      good_info
    })
    this.get_order_address();
    this.query_good_order_limit()
  },
  query_good_order_limit() {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'query_good_order_limit', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "good_id": this.data.good_info.good_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {

          that.setData({
            order_amount_7day: res.data.result
          })
        }
      },
      fail: function (error) {
        wx.hideLoading();
      }
    })
  },
  getuserinfo() {
    try {
      console.log("用户登录");
      //直接获取缓存保存的
      var openid = wx.getStorageSync('openid');
      console.log(openid)
      var that = this;
      if (openid == "" || openid == undefined) {
        console.log("需要登录获取openid")
        this.user_login();
      } else {
        //发起网络请求
        wx.request({
          url: app.globalData.hosturl + 'get_userinfo',
          data: {
            "user_id": openid
          },
          success: (res) => {
            console.log("获取用户信息")
            console.log(res.data)
            app.globalData.openid = res.data.user_id;
            app.globalData.checking_flag = res.data.checking_flag;
            app.globalData.login_userInfo = res.data;
            app.globalData.hasUserInfo = true;
            that.setData({
              userinfo: res.data,
              checking_flag: res.data.checking_flag,
            });
          }
        })
      }
    } catch (e) {
      console.log("持久化登录信息获取失败");
      console.log(e);
    }
  },

  user_login() {
    //return;
    var that = this;
    wx.login({
      success(res) {
        console.log("登录授权结果")
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.hosturl + 'getopenid',
            data: {
              code: res.code
            },
            success: (res) => {

              app.globalData.openid = res.data.openid;
              app.globalData.checking_flag = res.data.checking_flag;
              app.globalData.login_userInfo["user_id"] = res.data.openid;
              app.globalData.login_userInfo["nickName"] = res.data.nickName;
              app.globalData.login_userInfo["avatarUrl"] = res.data.avatarUrl;
              app.globalData.login_userInfo["gender"] = res.data.gender;
              app.globalData.login_userInfo["signature"] = res.data.signature;
              that.setData({
                userinfo: res.data,
                checking_flag: res.data.checking_flag,
              });
              try {
                wx.setStorageSync('openid', res.data.openid);
                app.globalData.hasUserInfo = true;
                //wx.setStorageSync('nickName', res.data.nickName);
              } catch (e) { }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail(res) {
        console.log("登录失败")
      },
      complete(res) {
        console.log("登录完成")
        console.log(res)
      }
    });
  },
  switch_listindex() {
    wx.navigateTo({
      url: '/pages/good/goodindex',
    })
  },
  get_order_address() {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'query_order_address', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          var address_list = that.data.address_list;
          res.data.result.forEach(item => {
            address_list.push(item)
          })
          that.setData({
            address_list: address_list
          })
        }
      },
      fail: function (error) {
        wx.hideLoading();
      }
    })
  },
  get_good_info(good_id) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.globalData.hosturl + 'query_good_info', //仅为示例，并非真实的接口地址
      data: {
        "good_id": good_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          var only_self_deliver = false;
          if (res.data.result["good_deliver_options"].length == 1 && res.data.result["good_deliver_options"][0] == "自提") {
            only_self_deliver = true;
          }
          that.setData({
            good_info: res.data.result,
            only_self_deliver: only_self_deliver
          })

        }
      },
      fail: function (error) {
        wx.hideLoading();
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
    console.log("gooddetail onshow")
    var cust_addr = {}
    if (app.globalData.contact_address != "") {
      cust_addr["联系人"] = app.globalData.contact_name
      cust_addr["联系方式"] = app.globalData.contact_tel
      cust_addr["收件地址"] = app.globalData.contact_address
      var address_list = this.data.address_list
      address_list.unshift(cust_addr)
      this.setData({
        address_list: address_list
      })
    }
    app.globalData.contact_name = ""
    app.globalData.contact_tel = ""
    app.globalData.contact_address = ""

    this.get_good_info(this.data.good_info.good_id);
  },
  ViewImage(e) {
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: this.data.good_info.good_img,
      current: e.currentTarget.dataset.url
    });
  },
  ViewImage2(e) {
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: this.data.good_info.good_img.concat(e.currentTarget.dataset.url),
      current: e.currentTarget.dataset.url
    });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let good_info = encodeURIComponent(JSON.stringify(this.data.good_info));
    return {
      title: "「" + this.data.good_info["good_price"] + "元」" + this.data.good_info["good_title"],
      //desc: '自定义分享描述',
      path: '/pages/good/gooddetail?good_info=' + good_info+'&&share_user_id='+app.globalData.login_userInfo["user_id"],
      //imageUrl:bgurl,
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log("成功", res)
        }
      },
      fail: function (res) {
        console.log("失败", res)
      }
    }
  },
  add_num() {
    var minusStatus = this.data.minusStatus;
    if (this.data.sel_good_amount > this.data.good_info.good_limit - 1) {
      minusStatus = "disabled"
    } else {
      minusStatus = "normal"
    }
    if (this.data.good_info.good_limit < 1) {
      return
    }
    if (this.data.good_info.good_limit - this.data.order_amount_7day < this.data.sel_good_amount + 1) {
      wx.showToast({
        title: '超过限购数量',
        icon: 'none',
        duration: 3000
      })

      return
    }
    this.setData({
      sel_good_amount: this.data.sel_good_amount + 1
    })
  },
  del_num() {
    var minusStatus = this.data.minusStatus;
    if (this.data.sel_good_amount <= 1) {
      minusStatus = "disabled"

    } else {
      minusStatus = "normal"
    }
    if (this.data.sel_good_amount <= 0) {
      return
    }
    this.setData({
      sel_good_amount: this.data.sel_good_amount - 1,
      minusStatus: minusStatus
    })
  },
  sel_address(e) {

    var addressindex = e.currentTarget.dataset.addressindex;
    this.setData({
      addressindex: addressindex
    })
  },
  choose_good_type(e) {
    var value = e.currentTarget.dataset.value;
    this.setData({
      sel_good_type: value
    })
  },
  choose_deliver(e) {
    var value = e.currentTarget.dataset.value;
    this.setData({
      sel_deliver: value
    })
    if (value == "自提") {
      this.setData({
        choose_selfget: true
      })
    }
  },
  choose_good_size(e) {
    var value = e.currentTarget.dataset.value;
    this.setData({
      sel_good_size: value
    })
  },
  choose_good_color(e) {
    var value = e.currentTarget.dataset.value;
    this.setData({
      sel_good_color: value
    })
  },
  new_address() {
    wx.navigateTo({
      url: 'address',
    })
  },
  edit_good() {
    var good_info = encodeURIComponent(JSON.stringify(this.data.good_info));
    wx.navigateTo({
      url: 'editgood?good_info=' + good_info,
    })
  },
  chat_with_dev() {
    wx.request({
      url: app.globalData.hosturl + 'get_customer_service',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let customer_service = encodeURIComponent(JSON.stringify(res.data));
        console.log(customer_service);
        wx.navigateTo({
          url: '../chat/chat?friend_user_info=' + customer_service,
        });
      }
    });

  },
  good_remark(e){
    this.setData({
      good_remark: e.detail.value
    })
  },
  go_to_miniprogram(e) {
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
  buy() {
    //下单
    console.log(this.data.share_user_id)
    console.log(JSON.stringify(this.data.address_list[this.data.addressindex]))
    if ((this.data.address_list.length <= 0 || this.data.addressindex < 0 || this.data.addressindex >= this.data.address_list.length)) {
      wx.showToast({
        title: '请选择地址',
        icon: 'error',
        duration: 3000
      })
    } else if (this.data.sel_good_type == "" && this.data.good_info.good_type.length > 0) {
      wx.showToast({
        title: '请选择型号',
        icon: 'error',
        duration: 3000
      })
    } else if (this.data.sel_good_size == "" && this.data.good_info.good_size.length > 0) {
      wx.showToast({
        title: '请选择规格',
        icon: 'error',
        duration: 3000
      })
    } else if (this.data.sel_good_color == "" && this.data.good_info.good_color.length > 0) {
      wx.showToast({
        title: '请选择颜色',
        icon: 'error',
        duration: 3000
      })
    } else if (this.data.sel_good_amount <= 0) {
      wx.showToast({
        title: '请选择商品数量',
        icon: 'error',
        duration: 3000
      })
    } else {
      wx.showLoading({
        title: '下单中...',
      })
      console.log("分享"+this.data.share_user_id)
      wx.request({
        url: app.globalData.hosturl + 'buy_good', //仅为示例，并非真实的接口地址
        data: {
          "user_id": app.globalData.login_userInfo["user_id"],
          "good_id": this.data.good_info.good_id,
          "order_amount": this.data.sel_good_amount,
          "good_size": this.data.sel_good_size,
          "good_color": this.data.sel_good_color,
          "good_type": this.data.sel_good_type,
          "good_deliver": this.data.sel_deliver,
          "good_remark":this.data.good_remark,
          "address": this.data.address_list[this.data.addressindex],
          "share_user_id":this.data.share_user_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading();

          if (res.data.code == 200) {
            wx.requestPayment({
              'timeStamp': res.data.result.timeStamp,
              'nonceStr': res.data.result.nonceStr,
              'package': res.data.result.package,
              'signType': res.data.result.signType,
              'paySign': res.data.result.paySign,
              'success': function (res) {
                // 进行逻辑判断
                console.log("成功支付")
                wx.showToast({
                  title: '下单成功',
                  icon: "success",
                  duration: 2000
                })
                wx.navigateTo({
                  url: '/pages/good/order?deliver_status=' + "",
                })

              },
              'fail': function (res) {
                console.log("取消支付")
                console.log(res)
              },
              'complete': function (res) {
                //接口调用结束的回调函数（调用成功、失败都会执行）
                console.log("支付")
              }
            })
          } else {
            wx.showToast({
              title: res.data.result,
              icon: "error",
              duration: 2000
            })
          }


        },
        fail: function (error) {
          wx.hideLoading();
        }
      })
    }
  }
})