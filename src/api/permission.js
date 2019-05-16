import request from '@/utils/request'

export function get(id) {
  return request({
    url: '/permission/' + id,
    method: 'get'
  })
}

export function remove(id) {
  return request({
    url: '/permission/delete/' + id,
    method: 'post'
  })
}

export function batchRemove(data) {
  return request({
    url: '/permission/delete/batch',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function create(data) {
  return request({
    url: '/permission/insert',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function updateSelective(data) {
  return request({
    url: '/permission/updateSelective',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function getPage(query) {
  return request({
    url: '/permission/page',
    method: 'get',
    params: query
  })
}

export function grant(data) {
  return request({
    url: '/permission/grant',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function selectAll() {
  return request({
    url: '/permission/all',
    method: 'get'
  })
}

export function selectIdsByRoleId(roleId) {
  return request({
    url: '/permission/role/' + roleId,
    method: 'get'
  })
}

