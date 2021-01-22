import {
  notification
} from 'antd'
// 全局提示
export const openNotificationWithIcon = params => {
  const {
    type,
    msg,
    desc
  } = params
  notification[type]({
    message: msg,
    description: desc
  })
}
// 工具类
export const toDecimal = (num, digits = 2) => {
  num = num + ""
  digits = Number(digits)
  // console.log("====toD", num, digits)
  // 取整数
  if (digits === 0) {
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
export const isJSON = (str) => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
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

// 交易相关
// --- 判断下单方向
export const isBuy = (type, filter = ["buy", "buylimit", "buystop"]) => {
  for (var _type of filter) {
    if (type.toLowerCase() === _type.toLowerCase()) return true
  }
  return false
}
export const getCmdArr = () => (
  ['Buy', 'Sell', 'Buy Limit', 'Sell Limit', 'Buy Stop', 'Sell Stop', 'Balance']
)

// 日期相关
export const currDateInfo = () => {
  let d = new Date()
  return ({
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minutes: d.getMinutes()
  })
}