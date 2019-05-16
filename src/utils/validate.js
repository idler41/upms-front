export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 验证规则：11位数字，以1开头。
 */
export function validMobile(rule, value, callback) {
  const re = /^1\d{10}$/
  value ? re.test(value) ? callback() : callback(new Error('手机号码格式错误')) : callback()
}

/**
 * 验证规则：区号+号码，区号以0开头，3位或4位。
 * 号码由7位或8位数字组成
 * 区号与号码之间可以无连接符，也可以“-”连接
 */
export function validPhone(rule, value, callback) {
  const re = /^0\d{2,3}-?\d{7,8}$/
  value ? re.test(value) ? callback() : callback(new Error('电话号码格式错误')) : callback()
}
