
//日期换算成今天明天昨天
function convert_date(date){
  var activity_date = new Date(date);
  var now_date = new Date();
  
  //计算时间差值，两个时间之间相差的毫秒数
  //1000/3600/24 ==> 换算成天数
  var d=parseInt((activity_date-now_date)/1000/3600/24);
  console.log(d);
  
  if(activity_date.getFullYear() == now_date.getFullYear() && activity_date.getMonth() == now_date.getMonth()){
    console.log("同一天");
    if(activity_date.getDate() == now_date.getDate() ){
      return "今天";
    }else if(activity_date.getDate() == (now_date.getDate()+1)){
      return "明天" ;
    }else if((activity_date.getDate()+1) == now_date.getDate()){
      return "昨天";
    }
  }
  if(d > 0 && (d + now_date.getDay()) < 7){
    var weekday=["周日","周一","周二","周三","周四","周五","周六"];
    return weekday[activity_date.getDay()];
  }
  return date;
}
function toweek(datetimestr){
  //let datestr = '2017-12-30'
  let datelist = ['周日','周一','周二','周三','周四','周五','周六']
  datetime1 = datetimestr.split(" ")[0];
  datetime1_1 = datetimestr.split(" ")[1];
  var nowyear = new Date();
  nowyear = nowyear.getFullYear();
  nowyear = nowyear.toString();
  datetime1 = datetime1.replace(nowyear,"");//年月日，转换成月日
  return datelist[new Date(datetime1).getDay()] + "("+datetime1+")";
}
function toweek2(datetimestr){
  //let datestr = '2017-12-30'
  let datelist = ['周日','周一','周二','周三','周四','周五','周六']
  var datetime1 = datetimestr.split("~")[0];
  var datetime2 = datetimestr.split("~")[1];
  datetime1 = datetime1.split(" ")[0];
  datetime1_1 = datetime1.split(" ")[1];
  datetime2 = datetime2.split(" ")[0];
  datetime2_1 = datetime2.split(" ")[1];

  if(datetime1 == datetime2){
    var res = datelist[new Date(datetime1).getDay()];
    return res + " " + datetime1_1 + "~" + datetime2_1;
  }else{
    var nowyear=new Date().getFullYear().toString();
    datetimestr = datetimestr.replace(nowyear,"");
    return datetimestr;
  }
  
}
// 方法定义 lat,lng 
function GetDistance( lat1,  lng1,  lat2,  lng2){
  var radLat1 = lat1*Math.PI / 180.0;
  var radLat2 = lat2*Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
  Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s *6378.137 ;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  //return "< "+Number(s.toFixed(1));//km
 
  return "< "+Math.ceil(s);//km
}
function calculateDistance(lat1, lon1, lat2, lon2) {
  // 地球半径，单位：千米
  const R = 6370.98; 

  // 将角度转换为弧度
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  // 将纬度转换为弧度
  const radLat1 = lat1 * (Math.PI / 180);
  const radLat2 = lat2 * (Math.PI / 180);

  // 应用 Haversine 公式
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // 计算距离
  const distance = R * c;
  return distance.toFixed(2);
}
/*获取当前页url*/
function getCurrentPageUrl(){
  let pages = getCurrentPages()    //获取加载的页面
  let currentPage = pages[pages.length-1]    //获取当前页面的对象
  let url = currentPage.route    //当前页面url
  return url//pages/index/index
}
function check_login(app){
  console.log("检查是否需要登录")
  console.log(app.globalData.login_userInfo)
  var info = app.globalData.login_userInfo;
  if(info["nickName"] != ""){
    console.log(info["nickName"])
    console.log("比较不出来吗？")
  }
  if(app.globalData.login_userInfo["user_id"] == ""||app.globalData.login_userInfo["user_id"] == undefined||app.globalData.login_userInfo["nickName"] == ""||app.globalData.login_userInfo["gender"] == -1||app.globalData.login_userInfo["nickName"] == "微信用户"/**||app.globalData.login_userInfo["avatarUrl"] == ""||app.globalData.login_userInfo["avatarUrl"] == "https://www.2week.club:5000/static/avatar/avatar.png"*/){
    console.log("跳转到登录界面")
    wx.navigateTo({
      url: '/pages/user/login?userInfo='+encodeURIComponent(JSON.stringify(app.globalData.login_userInfo)),
    })
    return false
  }
  return true
}
function get_open_id(app,that){
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
            if(res.data.code !=200){
              wx.showModal({
                title: '用户openid异常',
                content: '您的微信可能不兼容！',
                complete: (res) => {
                  if (res.cancel) {
                    
                  }
              
                  if (res.confirm) {
                    
                  }
                }
              })
              return;
            }
            app.globalData.login_userInfo = res.data.result;
            
              try {
                wx.setStorageSync('openid', res.data.result.user_id);
                app.globalData.hasUserInfo = true;
                
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
}
exports.convert_date = convert_date;
exports.toweek = toweek;
exports.toweek2 = toweek2;
exports.GetDistance = GetDistance;
exports.calculateDistance = calculateDistance;
exports.getCurrentPageUrl = getCurrentPageUrl;
exports.check_login = check_login;
exports.get_open_id = get_open_id
