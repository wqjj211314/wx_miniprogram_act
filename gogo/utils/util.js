
//日期换算成今天明天昨天
function convert_date(date){
  var activity_date = new Date(date);
  var now_date = new Date();
  console.log(activity_date.getFullYear());
  console.log(now_date.getFullYear());
  console.log(activity_date.getMonth());
  console.log(now_date.getMonth());
  console.log(activity_date.getDate());
  console.log(now_date.getDate());
  console.log(now_date.getDay());
  console.log(activity_date.getDay());
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
exports.convert_date = convert_date;
exports.toweek = toweek;
exports.toweek2 = toweek2;
