module.exports=(date)=>{
  let fmt = 'yyyy-MM-dd hh:mm:ss'
  const o = {
    // 'y+':date.getFullYear(),
    'M+': date.getMonth()+1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  //年份不补零
  if(/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1,date.getFullYear())
  }
  for(let i in o) {
    if(new RegExp('(' + i + ')').test(fmt)){
      fmt = fmt.replace(RegExp.$1, o[i].toString().length === 1 ? '0' + o[i] : o[i])
    }
  }
  return fmt
}