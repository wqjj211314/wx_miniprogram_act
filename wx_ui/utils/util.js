

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

exports.convert_date = convert_date
