import request from '@/utils/request'

export function get(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  })
}

export function getPage(query) {
  return request({
    url: '/user/page',
    method: 'get',
    params: query
  })
}

export function updateSelective(data) {
  return request({
    url: '/user/updateSelective',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function grant(data) {
  return request({
    url: '/user/grant',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function count() {
  return request({
    url: '/user/count',
    method: 'get'
  })
}

