import request from '@/utils/request'

export function get(id) {
  return request({
    url: '/role/' + id,
    method: 'get'
  })
}

export function remove(id) {
  return request({
    url: '/role/delete/' + id,
    method: 'post'
  })
}

export function batchRemove(data) {
  return request({
    url: '/role/delete/batch',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function create(data) {
  return request({
    url: '/role/insert',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function updateSelective(data) {
  return request({
    url: '/role/updateSelective',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function getPage(query) {
  return request({
    url: '/role/page',
    method: 'get',
    params: query
  })
}

export function getAll() {
  return request({
    url: '/role/all',
    method: 'get'
  })
}

export function getRolesByUser(userId) {
  return request({
    url: '/role/user/' + userId,
    method: 'get'
  })
}

export function grant(data) {
  return request({
    url: '/role/grant',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function selectGrantVoByRoleId(roleId) {
  return request({
    url: '/role/menu-resource-permission/' + roleId,
    method: 'get'
  })
}
