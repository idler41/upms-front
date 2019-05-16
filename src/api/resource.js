import request from '@/utils/request'

export function get(id) {
  return request({
    url: '/resource/' + id,
    method: 'get'
  })
}

export function remove(id) {
  return request({
    url: '/resource/delete/' + id,
    method: 'post'
  })
}

export function create(data) {
  return request({
    url: '/resource/insert',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function updateSelective(data) {
  return request({
    url: '/resource/updateSelective',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data
  })
}

export function selectTree() {
  return request({
    url: '/resource/tree',
    method: 'get'
  })
}

export function selectAll() {
  return request({
    url: '/resource/all',
    method: 'get'
  })
}

export function selectIdsByRoleId(roleId) {
  return request({
    url: '/resource/leaf-role/' + roleId,
    method: 'get'
  })
}

export function selectIdsByRoleIds(data) {
  return request({
    url: '/resource/leaf-roles',
    method: 'get',
    params: { roleIds: data }
  })
}

