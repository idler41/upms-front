import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  const path = to.path.indexOf('?') !== -1 ? to.path.match(/(\S*)?/)[1] : to.path
  if (whiteList.indexOf(path) !== -1) {
    next()
    NProgress.done() // 结束Progress
    return
  }

  if (getToken()) {
    if (store.getters.name === '') {
      store.dispatch('GetInfo').then(() => { // 拉取用户信息
        router.addRoutes(store.getters.addRoutes) // 动态添加可访问路由表
        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      })
    } else {
      next()
    }
  } else {
    next(`/login?redirect=${path}`) // 否则全部重定向到登录页
    NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
