import { TokenKey, getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import { body2Obj } from './utils'

const users = {
  'user01': {
    permissions: [],
    nickname: '普通用户',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'user01'
  },
  'root': {
    permissions: ['*-add'],
    menus: [
      {
        menuKey: 'sys-manager',
        menuDesc: '系统管理',
        icon: 'sys-manager',
        children: [
          {
            menuKey: 'page-manager',
            menuDesc: '页面管理',
            icon: 'page-manager',
            children: [
              { menuKey: 'menu-manager', menuDesc: '目录管理', icon: 'tree' },
              { menuKey: 'resource-manager', menuDesc: '资源管理', icon: 'resource' },
              {
                menuKey: 'show-manager',
                menuDesc: '根目录1',
                icon: 'dashboard',
                children: [
                  { menuKey: 'show-manager2', menuDesc: '根目录2', icon: 'dashboard' }
                ]
              }
            ]
          },
          { menuKey: 'user-manager', menuDesc: '用户管理', icon: 'people-manager' },
          { menuKey: 'role-manager', menuDesc: '角色管理', icon: 'role-manager' },
          { menuKey: 'permission-manager', menuDesc: '权限管理', icon: 'permission-manager' }
        ]
      },
      { menuKey: 'show-manager3', menuDesc: '根目录3', icon: 'dashboard', children: [{ menuKey: 'show-manager4', menuDesc: '根目录4', icon: 'dashboard' }] },
      { menuKey: 'show-manager5', menuDesc: '根目录5', icon: 'dashboard' },
      { menuKey: 'hidden-manager', menuDesc: '隐藏目录测试数据', icon: 'dashboard', hidden: true }
    ],
    nickname: '管理员',
    avatar: '',
    name: 'root'
  }
}

export default {
  login: res => {
    const { username } = body2Obj(res.body)
    const data = users[username]

    if (data) {
      Cookies.set(TokenKey, username, { domain: 'am-server-dev', expires: 7 })
      return {
        code: 200,
        data
      }
    }
    return {
      code: 200,
      data: {
        code: 404,
        message: 'Account and password are incorrect.'
      }
    }
  },

  getInfo: res => {
    const info = users[getToken()]

    if (info) {
      return {
        code: 200,
        data: info
      }
    }
    return {
      code: 200,
      data: {
        code: 404,
        message: 'Login failed, unable to get user details.'
      }
    }
  },

  logout: () => {
    return {
      code: 200,
      data: 'success'
    }
  }
}

