export const toDecimal = (num, digits = 2) => {
  num = num + ""
  digits = Number(digits)
  // 取整数
  if(digits === 0) {
    return num.split(".")[0]
  }
  // 截取小数点后digits位
  if (num.indexOf(".") !== -1) {
    num = num.substring(0, num.indexOf(".") + digits + 1)
  } else {
    num += "."
  }
  while (digits - num.split(".")[1].length > 0) {
    num += "0"
  }
  return num
}


export const getCurrDate = () => {
  const _date = new Date(),
        year = _date.getFullYear(),
        month = ('0' + (_date.getMonth() + 1)).slice(-2),
        date = ('0' + _date.getDate()).slice(-2),
        hour = ('00' + _date.getHours()).slice(-2),
        minute = ('00' + _date.getMinutes()).slice(-2),
        second = ('00' + _date.getSeconds()).slice(-2)

  return `${year}年${month}月${date}日 ${hour}:${minute}:${second}`
}