const socket = require("../../utils/socket.js");
const generate_route = require("generate_route.js");
const util = require("../../utils/util.js");
var doommList = [];
const app = getApp();
const iotest = require("../index/weapp.socket.io.js"); // 引入 socket.io
var onSockettest = "" // 连接 socket
Page({
  data: {
    doommData: doommList,
    chat_msgs: [],
    scrollTop: 0,
    inputMsg: '',

    vertical: true,
    activity_id: "", //当前所要展示的id，主要用于活动页切换首页的首个id显示
    activity_info: [],
    login_userInfo: {},
    duration: 300, //动画时常,
    friend_chat_msg_display: false,
    longitude: 120.121431,
    latitude: 30.221378, //默认杭州西湖
    scale: 15,
    startPoint: [],
    endPoint: [],
    waypoints: [],
    markers: [],//路线的marker
    
    mapWidth: 0,
    mapHeight: 0,
    polyline: [],
    member_num_user_dict: {},
    user_markers: [],
    all_markers:[],//路线marker+用户marker
    part_member_num:""
  },
  onLoad: function (options) {
    console.log("onload函数");
    console.log(options)
    if (options.hasOwnProperty("activity_info")) {
      const route = JSON.parse(decodeURIComponent(options.activity_info)).route;
      if (route.hasOwnProperty("scale")) {
        this.setData({
          scale: route.scale,
          startPoint: route.markers[0],
          endPoint: route.markers[route.markers.length - 1],
          markers: route.markers,
          route_title: route.route_name,
          latitude: route.markers[0].latitude,
          longitude: route.markers[0].longitude
        });
        const query = wx.createSelectorQuery();
        query.select('#routeMap').boundingClientRect((rect) => {
          if (rect) {
            this.setData({
              mapWidth: rect.width,
              mapHeight: rect.height
            });
            //确定缩放
            const {
              longitude,
              latitude,
              scale
            } = generate_route.calculateCenterAndScale(route.markers, rect.width, rect.height);

            //背景路线图
            generate_route.generateRoute(route.markers, this);

            this.setData({
              longitude,
              latitude,
              scale
            })
          }
        }).exec();
      }
    }

    let activity_info = JSON.parse(decodeURIComponent(options.activity_info));
    this.setData({
      activity_info: activity_info
    })
    this.get_member_list(activity_info)
    this.socketinit(activity_info.activity_id)
    this.get_init_msg(activity_info.activity_id)
  },
  get_member_list(activity_info) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_memberlist', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_info.activity_id,
        "hobby_tag": activity_info.activity_tag,
        "user_id": app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var info = res.data["user_info_part_info_list"];
        var member_num_user_dict = {};
        info.forEach(item => {
          var member_num = item.member_num;
          member_num_user_dict[member_num] = item;
          if (item["user_id"] == app.globalData.login_userInfo["user_id"]) {
            console.log("是否参与")
            that.setData({
              part_member_num: item.member_num
            })
          }
        })
        that.setData({
          member_num_user_dict,
          entire_part_info: info
        })
        wx.hideLoading();
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: "活动异常",
          icon: "error"
        })
      }
    });

  },
  socketinit(activity_id) {
    var that = this;
    if (onSockettest != "") {
      console.log("断开socket")
      onSockettest.close(); //关闭连接
    }
    onSockettest = iotest(app.globalData.hosturl, {
      pingInterval: 25000,
      pingTimeout: 60000
    }) // 连接 socket
    console.log("socket")
    console.log("还在用？")
    console.log(onSockettest)
    app.globalData.onSockettest = onSockettest
    onSockettest.on('connect', function (res) { // 监听socket 是否连接成功
      console.log("监听成功");
      onSockettest.emit("join_act_room", {
        activity_id: activity_id
      });
    });

    //普通聊天消息，更新聊天记录和位置
    onSockettest.on('new_chat_msg', (new_chat_msg) => {
      console.log("收到新消息socket")
      /**
       * {
                    'user_id':user_id,
                    'nickName':nickName,
                    'chatmsg': final_new_chat_msg,
                    'latitude':latitude,
                    'longitude':longitude,
                    'member_num':member_num
                    }
       */
      console.log(new_chat_msg);
      console.log(this.data.chat_msgs);

      var chat_msgs = this.data.chat_msgs;
      if (new_chat_msg.user_id != app.globalData.login_userInfo["user_id"]) {
        //消息是本人发的不显示，因为本地发的时候已经加上了
        new_chat_msg["id"] = chat_msgs.length
        chat_msgs.push(new_chat_msg);
        var top = chat_msgs.length * 100;
        this.setData({
          chat_msgs: chat_msgs,
          scrollTop: top
        });
        console.log(this.data.chat_msgs);
      }
      this.update_user_marker(new_chat_msg, 1) //普通聊天消息
    });
    //位置监听，仅更新位置，或者置顶显示
    onSockettest.on('new_location', (new_location) => {
      console.log("收到位置更新socket")
      /**
       * {'user_id':user_id,
                                  'latitude':latitude,
                                  'longitude': longitude,
                                    'msgtype':msgtype
                                    }
       */
      console.log(new_location)
      console.log(new_location["msgtype"])
      console.log(new_location.msgtype)
      this.update_user_marker(new_location, new_location["msgtype"])
    })
  },
  get_init_msg(activity_id) {
    const that = this;
    var chat_msgs = [];
    wx.request({
      url: app.globalData.hosturl + 'get_init_msg', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data != "fail") {

          console.log("聊天消息数量" + res.data.length);
          res.data.forEach(element => {
            console.log(element);
            chat_msgs.unshift(element);
          });


          that.setData({
            chat_msgs: chat_msgs,
            scrollTop: 0
          });
        }
      }
    });
  },
  update_user_marker(info, msgtype = 1) {
    //1普通聊天消息，直接更新对应marker的location，不改变顺序，但是如果是本人就要更改顺序
    //2仅更新位置，直接更新对应marker的location，不改变顺序，但是如果是本人就要更改顺序
    //3更新位置并置顶，更新对应marker的location，而且要更改顺序
    var user_markers = this.data.user_markers;
    var new_user_markers = [];
    var top_marker = "";
    var self_marker = "";

    var add_marker = 1;

    //更新或添加user_marker，是否置顶,top_marker不一定是本人
    //摘出来self_marker,摘出来top_marker,有可能是同一个，或者都没找到
    for (var index in user_markers) {
      var marker = user_markers[index]
      //收到的更新
      if (marker.customerData.user_id == info.user_id) {
        console.log("找到了marker，不需要新增")
        add_marker = 0;
        //更新
        marker.latitude = info.latitude
        marker.longitude = info.longitude
        //自身marker
        if (marker.customerData.user_id == app.globalData.login_userInfo["user_id"]) {
          console.log("找到self marker")
          self_marker = marker;
          if (msgtype == 3) {
            top_marker = marker;
          }
          continue;
        }
        if (msgtype == 3) {
          top_marker = marker;
          continue;
        }
      }
      marker["callout"] = undefined
      marker["id"] = this.data.markers.length +  new_user_markers.length
      new_user_markers.push(marker)

    }
    //首次进入没有对应marker，有对应marker要更新气泡框，有对应marker只更新位置
    //没找到marker，新增一个
    console.log(msgtype)
    if (add_marker == 1) {
      console.log("新增marker")
      //https://www.2week.club:5000/static/avatar/o1fAa5PPELB1SokZQPZLzwcRHwa01725352466.jpg
      var avatarUrl = info.avatarUrl;
      var templist = avatarUrl.split("/")
      var filename = templist[templist.length - 1]
      var filenameonly = filename.split(".")[0]

      var new_marker = {
        id: this.data.markers.length +  new_user_markers.length,
        longitude: parseFloat(info.longitude),
        latitude: parseFloat(info.latitude),
        title: info.nickName,
        width: 60,
        height: 60,
        iconPath: 'https://www.2week.club:5000/static/avatar/' + filenameonly + '_mapicon.png',
        customerData:{
          'user_id':info.user_id
        }
      }
      if (msgtype == 3) {
        //要加气泡框
        if(info.user_id==app.globalData.login_userInfo["user_id"]){
          this.setData({
            longitude: parseFloat(info.longitude),
            latitude: parseFloat(info.latitude),
          })
        }
        
        new_marker["callout"] = {
          content: `我在这~我在这！`,
          color: '#000',
          fontSize: 12,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ccc',
          bgColor: '#fff',
          padding: 10,
          display: "ALWAYS",
          textAlign: 'center',
        }
      }
      new_user_markers.push(new_marker)

    } else {
      //有自身marker
      if (self_marker != "") {
        if (msgtype == 3&&info.user_id==app.globalData.login_userInfo["user_id"]) {
          //要加气泡框
          if(info.user_id==app.globalData.login_userInfo["user_id"]){
            this.setData({
              longitude: parseFloat(info.longitude),
              latitude: parseFloat(info.latitude),
            })
          }
          self_marker["callout"] = {
            content: `我在这~我在这！`,
            color: '#000',
            fontSize: 12,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#ccc',
            bgColor: '#fff',
            padding: 10,
            display: "ALWAYS",
            textAlign: 'center',
          }
        }
        console.log("push self marker")
        self_marker["id"] = this.data.markers.length +  new_user_markers.length
        new_user_markers.push(self_marker)
      }
      
      if (top_marker != "") {
        if(self_marker!=""&& top_marker.iconPath == self_marker.iconPath){
          console.log("自己要TOP就不用push了，前面加了")
        }else{
          if (msgtype == 3) {
            //要加气泡框
            top_marker["callout"] = {
              content: `我在这~我在这！`,
              color: '#000',
              fontSize: 12,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#ccc',
              bgColor: '#fff',
              padding: 10,
              display: "ALWAYS",
              textAlign: 'center',
            }
          }
          console.log("push top marker")
          top_marker["id"] = this.data.markers.length +  new_user_markers.length
          new_user_markers.push(top_marker)
        }
       
      }
    }

    this.setData({
      user_markers: new_user_markers,
      all_markers: [...this.data.markers, ...new_user_markers]
    })
    console.log(new_user_markers)
  },
  top_my_marker() {
    //1普通聊天信息和位置更新，2位置更新socket，3举手位置更新和置顶显示socket
    console.log("置顶显示我")
    this.confirm_location_auth_then_get_location_then_do(this.socket_update_location, 3)
  },
  only_update_marder_location() {
    this.confirm_location_auth_then_get_location_then_do(this.socket_update_location, 2)
  },
  socket_update_location(latitude, longitude, msgtype) {
    // dofunction(latitude,longitude,msgtype)
    console.log("emit位置更新socket")
    onSockettest.emit("update_location", {
      activity_id: this.data.activity_info.activity_id, //房间号
      user_id: app.globalData.login_userInfo["user_id"],
      //avatarUrl:app.globalData.login_userInfo["avatarUrl"],//显示iconpath
      latitude: latitude, //更新经纬度
      longitude: longitude,
      msgtype: msgtype,
      avatarUrl: app.globalData.login_userInfo["avatarUrl"]
    });
  },

  openKey(e) {
    console.log('onClick', e.detail)
    if (!util.check_login(app)) {
      return;
    }
    this.setData({
      isdisplay: false,
      //isFocus:true
    });
  },
  onblurkey() {
    console.log("onblurkey");
    this.setData({
      isFocus: false,
      isdisplay: true
    })
  },
  inputMsg: function (e) {
    this.setData({
      inputMsg: e.detail.value
    });
  },
  new_msg() {
    //1仅位置更新，2普通聊天信息，3举手置顶显示
    //var msgytpe = e.currentTarget.dataset.msgtype;
    this.confirm_location_auth_then_get_location_then_do(this.sendMsg, 1);
  },
  sendMsg(latitude, longitude, msgtype = 1) {
    console.log(this.data.inputMsg);
    var send = this.data.inputMsg.trim();
    if (send == "") {
      this.setData({
        inputMsg: ""
      });
      return;
    }
    var activity_id = this.data.activity_info.activity_id;
    var chat_msgs = this.data.chat_msgs;

    var new_msg = {
      'id': chat_msgs.length,
      'user_id': app.globalData.login_userInfo["user_id"],
      'nickName': app.globalData.login_userInfo["nickName"],
      'chatmsg': send,
      'latitude': latitude,
      'longitude': longitude
    }
    chat_msgs.push(new_msg);
    var top = chat_msgs.length * 100;
    console.log("本地直接添加新消息")
    console.log(new_msg)
    this.setData({
      chat_msgs: chat_msgs,
      scrollTop: top
    });

    wx.request({
      url: app.globalData.hosturl + 'push_activity_chat_msg', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "nickName": app.globalData.login_userInfo["nickName"],
        "user_id": app.globalData.login_userInfo["user_id"],
        "avatarUrl": app.globalData.login_userInfo["avatarUrl"],
        "new_chat_msg": send,
        "latitude": latitude,
        "longitude": longitude,
        "msgtype": 2,
        //"member_num": this.data.part_member_num,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

      }
    });

    this.setData({
      inputMsg: ""
    });
  },
  confirm_location_auth_then_get_location_then_do: function (dofunction, msgtype) {
    let that = this;
    // 获取位置信息
    wx.getSetting({
      success: (res) => {
        console.log("位置信息" + res)
        console.log(res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
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
                      that.getLocation(dofunction, msgtype);
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
        } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
          that.getLocation(dofunction, msgtype);

        } else { //授权后默认加载
          that.getLocation(dofunction, msgtype);
        }
      }
    })

  },
  getLocation(dofunction, msgtype) {
    var that = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        wx.getLocation({
          type: 'wgs84',
          success(res) {
            console.log("获取位置")
            console.log(res)
            const latitude = res.latitude
            const longitude = res.longitude
            dofunction(latitude, longitude, msgtype)

          }
        })

      }
    });

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    onSockettest.emit("leave_act_room", {
      activity_id: this.data.activity_id
    });
    onSockettest.close()
  },

})