import Mock from 'mockjs'
import userAPI from './user'

// Fix an issue with setting withCredentials = true, cross-domain request lost cookies
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}
// Mock.setup({
//   timeout: '350-600'
// })

// User
Mock.mock(/\/account\/login/, 'post', userAPI.login)
Mock.mock(/\/account\/info/, 'get', userAPI.getInfo)
Mock.mock(/\/account\/logout/, 'post', userAPI.logout)

export default Mock
