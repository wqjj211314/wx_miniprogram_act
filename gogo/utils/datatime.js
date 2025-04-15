//js中给定日期时间字符串，计算出减去24h的日期时间，输出格式化YYYY-MM-DD HH:MM字符串
function subtractHours(dateTimeStr,num) {
  // 将输入的日期时间字符串转换为 Date 对象
  const inputDate = new Date(dateTimeStr);
  // 计算减去 24 小时后的时间戳
  const newTimestamp = inputDate.getTime() - num * 60 * 60 * 1000;
  // 根据新的时间戳创建新的 Date 对象
  const newDate = new Date(newTimestamp);

  // 获取年、月、日、小时和分钟
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');
  const hours = String(newDate.getHours()).padStart(2, '0');
  const minutes = String(newDate.getMinutes()).padStart(2, '0');

  // 格式化输出
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
function addHours(dateTimeStr,num) {
  // 将输入的日期时间字符串转换为 Date 对象
  const inputDate = new Date(dateTimeStr);
  // 计算减去 24 小时后的时间戳
  const newTimestamp = inputDate.getTime() + num * 60 * 60 * 1000;
  // 根据新的时间戳创建新的 Date 对象
  const newDate = new Date(newTimestamp);

  // 获取年、月、日、小时和分钟
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');
  const hours = String(newDate.getHours()).padStart(2, '0');
  const minutes = String(newDate.getMinutes()).padStart(2, '0');

  // 格式化输出
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
function getCurrentFormattedTime() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

exports.subtractHours = subtractHours;
exports.addHours = addHours;
exports.getCurrentFormattedTime = getCurrentFormattedTime;
  