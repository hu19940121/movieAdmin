import request from '@/utils/request'

// 获取频道列表
export function getChannel(params) {
  return request({
    url: '/api/v1/channel/channelList',
    method: 'get',
    params
  })
}
// 增加频道
export function addChannel(params) {
  return request({
    url: '/api/v1/channel/add',
    method: 'POST',
    data: params
  })
}
// 删除频道
export function delChannel(id) {
  return request({
    url: '/api/v1/channel/del',
    method: 'get',
    params: { id }
  })
}
// 获取频道详情
export function getChannelById(id) {
  return request({
    url: '/api/v1/channel/getChannelById',
    method: 'get',
    params: { id }
  })
}
// 更新频道
export function updateChannel(params) {
  return request({
    url: '/api/v1/channel/updateChannel',
    method: 'post',
    data: params
  })
}
