import { logout, getInfo } from '@/api/user'
import { removeToken } from '@/utils/auth'
import { constantRoutes, buildRouter } from '@/router'

const user = {
  state: {
    name: '',
    avatar: '',
    routes: [],
    addRoutes: [],
    permissions: []
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ADD_ROUTES: (state, addRoutes) => {
      state.addRoutes = addRoutes
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          commit('SET_NAME', response.data.nickname || 'null')
          commit('SET_AVATAR', response.data.avatar || '')
          const addRoutes = buildRouter(response.data.menus || [])
          commit('SET_ADD_ROUTES', addRoutes)
          const routes = constantRoutes.concat(addRoutes)
          commit('SET_ROUTES', routes)
          commit('SET_PERMISSIONS', response.data.resourceKey || [])
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_NAME', '')
          commit('SET_AVATAR', '')
          commit('SET_ADD_ROUTES', [])
          commit('SET_ROUTES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          location.reload()
          resolve()
        }).catch(error => {
          removeToken()
          location.reload()
          reject(error)
        })
      })
    },

    // 清除缓存信息
    clearCache({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ADD_ROUTES', [])
        commit('SET_ROUTES', [])
        commit('SET_PERMISSIONS', [])
        location.reload()
      })
    }
  }
}

export default user
