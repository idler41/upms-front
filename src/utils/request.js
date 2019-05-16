import axios from 'axios'
import qs from 'qs'
import { Notification, MessageBox } from 'element-ui'
import router from '../router'
import { removeToken } from './auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// 默认请求头
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// service.defaults.withCredentials = true

// request拦截器
service.interceptors.request.use(
  config => {
    if (config.data) {
      if (config.method === 'post' && config.headers['Content-Type'] === 'application/json;charset=UTF-8') {
        config.data = JSON.stringify(config.data)
      } else {
        config.data = qs.stringify(config.data)
      }
    }
    return config
  },
  error => {
    // Do something with request error
    console.error(error) // for debug
    Promise.reject(error)
  }
)

const whiteList = [20002] // 不弹窗异常代码白名单

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.data && response.data.code !== 200 && whiteList.indexOf(response.data.code) === -1) {
      Notification.warning({
        title: '系统警告!',
        message: response.data.message,
        duration: 5 * 1000
      })
      return Promise.reject('业务警告:code=' + response.data.code + ',message:' + response.data.message)
    }
    return response.data || response
  },
  error => {
    if (error.response.status === 401) {
      MessageBox.confirm(
        '登录异常，请重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 删除cookie + 重定向到登录页面
        removeToken()
        const currentPath = router.history.current.path
        const path = '/login' + (currentPath && currentPath.indexOf('/login') !== 0 && currentPath.indexOf('/404') !== 0 ? '?redirect=' + currentPath : '')
        router.push(path)
      }).catch(() => {
        // 取消
        return Promise.reject(error)
      })
      return Promise.reject(error)
    }
    // 未知异常
    console.log('err' + error) // for debug
    Notification.error({
      title: '系统异常!',
      message: error.message,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
