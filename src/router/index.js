import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '',
    rootRedirect: true,
    component: Layout,
    redirect: 'dashboard',
    children: [{
      name: 'Dashboard',
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const asyncRouterMap = {
  // 目录
  'sys-manager': { path: 'sys' },
  'user-manager': { path: 'user-manager', component: () => import('@/views/user/index') },
  'role-manager': { path: 'role-manager', component: () => import('@/views/role/index') },
  'permission-manager': { path: 'permission-manager', component: () => import('@/views/permission/index') },
  'resource-manager': { path: 'resource-manager', component: () => import('@/views/resource/index') }
}

const unFound = { path: '*', redirect: '/404', hidden: true }

let times = 0

function getComponent(menu) {
  return asyncRouterMap[menu.resourceKey] || { path: 'blank' + times++, name: 'blank' + times, component: () => import('@/views/blank/index') }
}

export function buildRouter(menus) {
  const result = menuFormatRouter(menus, '')
  result.push(unFound)
  return result
}

function menuFormatRouter(menus, parentPath) {
  const result = []

  for (const menu of menus) {
    const component = getComponent(menu)

    // 根目录同时是可展开页面
    if (isRoot(menu) && menu.type === 1) {
      const router = {}
      router.rootRedirect = true
      router.path = ''
      router.component = Layout
      router.redirect = component.path
      router.children = [{ name: menu.resourceKey, path: component.path, component: component.component, meta: { icon: menu.icon, title: menu.label }}]
      result.push(router)
      continue
    }

    const router = { name: menu.resourceKey, type: menu.type, meta: { icon: menu.icon, title: menu.label }}

    const currentPath = parentPath + '/' + component.path
    router.path = currentPath
    router.component = component.component
    if (router.type === 0) {
      // 可展开目录
      if (isRoot(menu)) {
        router.component = Layout
      }
      if (menu.children) {
        router.redirect = currentPath + getFirstChildrenPath(menu.children[0])
        router.children = menuFormatRouter(menu.children, currentPath)
      }
    }

    result.push(router)
  }

  return result
}

function isRoot(menu) {
  return menu.parentId === 0
}

function getFirstChildrenPath(menu) {
  if (!menu) {
    return ''
  }
  const path = '/' + getComponent(menu).path
  return menu.children && menu.children[0] ? path + getFirstChildrenPath(menu.children[0]) : path
}
