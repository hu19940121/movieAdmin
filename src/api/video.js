import request from '@/utils/request'

// 获取列表
export function list(params) {
  return request({
    url: '/api/v1/video/list',
    method: 'get',
    params
  })
}
// 增加
export function add(params) {
  return request({
    url: '/api/v1/video/add',
    method: 'POST',
    data: params
  })
}
// 删除
export function del(id) {
  return request({
    url: '/api/v1/video/del',
    method: 'get',
    params: { id }
  })
}
// 获取详情
export function getItemById(id) {
  return request({
    url: '/api/v1/video/getItemById',
    method: 'get',
    params: { id }
  })
}
// 更新
export function update(params) {
  return request({
    url: '/api/v1/video/update',
    method: 'post',
    data: params
  })
}
