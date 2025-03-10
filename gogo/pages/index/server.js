const swiper = require("swiper.js");
const share = require("../activityshowinfo/share.js")
function get_activity_list(that,app,activity_id="") {
  console.log("获取活动列表");
  var id = "";
  
  if(activity_id =="" || activity_id == "refresh"){//直接刷新
    id = "";
  }else{
    id = activity_id;
  }
  console.log(id);
  wx.showLoading({
    title: '',
  });
  var _that = that;
  try {
    var user_id = "";
    user_id = wx.getStorageSync('openid');
  } catch (e) { }
  wx.request({
    url: app.globalData.hosturl + 'get_activity_list', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": id,
      "user_id":user_id,
      "server_request_count":_that.data.server_request_count
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
        isdisplay:true
      })
      //初始化第一个id
      var first = _that.data.activity_list;
      console.log("活动创建人" + first[0]);
      console.log("活动创建人" + first[0].createuser);
      console.log("更新参与人数" + first[0].member);
      _that.setData({
        first_activity_id: first[0].activity_id,
        activity_id: first[0].activity_id,
        member: first[0].member,
        server_request_count:_that.data.server_request_count + 1,
        is_begin: new Date(first[0]["begintime"]) - new Date() <= 0,
      is_end: new Date(first[0]["endtime"]) - new Date() <= 0,
      is_addend: new Date(first[0]["addendtime"]) - new Date() <= 0,
      is_cancelend:new Date(first[0]["cancelendtime"]) - new Date() <= 0,
      });
      console.log("初始化第一个activity id = " + first[0].activity_id);
      //_that.socketinit();
      swiper.update_swiper(_that,0,0,0,_that.data.activity_list,_that.data.recyler_list);
      //这里应该将活动信息和用户信息都提取保存起来
      _that.getstore_activity_user_info(first[0].activity_id);
      get_init_msg(_that,app,first[0].activity_id);
      share.get_activity_moods(app.globalData.hosturl, _that, first[0].activity_id);
      wx.stopPullDownRefresh();
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

}
function get_init_msg(that,app,id) {
  const _that = that;
  console.log("获取聊天信息：" + id);
  var doommList = [];
  wx.request({
    url: app.globalData.hosturl + 'get_init_msg', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      if (res.data != "fail") {
        //聊天消息
        var list = _that.data.activity_list;
        console.log("聊天消息数量"+res.data.length);
        res.data.forEach(element => {
          console.log(element);
          doommList.unshift(element);
        });
        
        //活动信息
        var info = _that.data.activity_info;
        if(info.announcement != ""){
          
          //doommList.unshift("最新公告："+info.announcement);
        }
        
        console.log(info);
        var ainfo = [];
        ainfo.unshift("活动详情：" + info.detail);
        ainfo.unshift("活动时间：" + info.activity_live);
        //ainfo.unshift("报名人数：" + info.member);
        ainfo.unshift("活动地点：" + info.activityaddress);
        //ainfo.unshift(info.title);
        _that.setData({
          chat_msgs: doommList,
          activityinfo: ainfo,
          scrollTop: 0
        });
      }
    }
  });
}
function get_friend_newest_chat_msg(that,app) {
  console.log("get_friend_newest_chat_msg");
  const _that = that;
  _that.setData({
    friend_chat_msg_display:app.globalData.friend_chat_msg_display
  });
  try {
    var user_id = "";
    user_id = wx.getStorageSync('openid');
  } catch (e) { }
  wx.request({
    url: app.globalData.hosturl + 'get_friend_newest_chat_msg', //仅为示例，并非真实的接口地址
    data: {
      "user_id": user_id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log("get_friend_newest_chat_msg");
      console.log(res);
      console.log(wx.getStorageSync('newest_friend_chat_msg_time'));

      if(res.data != null){
        var msg_time = res.data.msgtime;
        var msg_time_date = new Date(msg_time);
        var last_time_date = new Date("2022-01-01 23:17:51");
        try {
            console.log(wx.getStorageSync('newest_friend_chat_msg_time'));
            if(wx.getStorageSync('newest_friend_chat_msg_time')!=""){
              last_time_date = new Date(wx.getStorageSync('newest_friend_chat_msg_time'));
            if(msg_time_date > last_time_date){
              _that.setData({
                friend_chat_msg_display:true
              });
              wx.setStorageSync('newest_friend_chat_msg_time', msg_time);
              app.globalData.friend_chat_msg_display = true;
            }
          }else{
            _that.setData({
              friend_chat_msg_display:true
            });
            wx.setStorageSync('newest_friend_chat_msg_time', msg_time);
            app.globalData.friend_chat_msg_display = true;
          }
          
        } catch (e) { }
      }

     
    }
  });
}
function newuser(app,nickname, avatarUrl, gender) {
  console.log("用户头像" + avatarUrl);
  wx.request({
    url: app.globalData.hosturl + 'newuser', //仅为示例，并非真实的接口地址
    data: {
      "openid": app.globalData.openid,
      "nickName": nickname,
      "avatarUrl": avatarUrl,
      "gender": gender
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {

    }
  })
}
exports.get_activity_list = get_activity_list
exports.get_init_msg = get_init_msg
exports.newuser = newuser
exports.get_friend_newest_chat_msg = get_friend_newest_chat_msg