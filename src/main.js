import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import router from './router'
import store from './store'
import App from './App.vue'

import '@/icons' // icon

import '@/utils/directives'

import '@/permission' // permission control
// import '../mock' // simulation data
import * as filters from './filters' // global filters

import _ from 'lodash'

Vue.use(ElementUI, { locale, size: 'small' })

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// vue 使用第三方库
Object.defineProperty(Vue.prototype, '$_', { value: _ })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
