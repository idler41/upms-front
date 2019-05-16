import Cookies from 'js-cookie'

export const TokenKey = 'JSESSIONID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
