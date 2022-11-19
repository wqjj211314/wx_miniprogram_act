

function convert_date(date){
  var activity_date = new Date(date);
  var now_date = new Date();
  console.log(activity_date.getFullYear());
  console.log(now_date.getFullYear());
  console.log(activity_date.getMonth());
  console.log(now_date.getMonth());
  console.log(activity_date.getDate());
  console.log(now_date.getDate());
  
  if(activity_date.getFullYear() == now_date.getFullYear() && activity_date.getMonth() == now_date.getMonth()){
    console.log("同一天");
    if(activity_date.getDate() == now_date.getDate() ){
      return "今天";
    }else if(activity_date.getDate() == (now_date.getDate()+1)){
      return "明天";
    }else if((activity_date.getDate()+1) == now_date.getDate()){
      return "昨天";
    }
  }
  return date;
}

exports.convert_date = convert_date
