import request from '@/utils/request'

// 获取轮播图列表
export function getSwiper(params) {
  return request({
    url: '/api/v1/swiper/swiperList',
    method: 'get',
    params
  })
}
// 增加轮播图
export function addSwiper(params) {
  return request({
    url: '/api/v1/swiper/add',
    method: 'POST',
    data: params
  })
}
// 删除轮播图
export function delSwiper(id) {
  return request({
    url: '/api/v1/swiper/del',
    method: 'get',
    params: { id }
  })
}
// 获取轮播图详情
export function getSwiperById(id) {
  return request({
    url: '/api/v1/swiper/getSwiperById',
    method: 'get',
    params: { id }
  })
}
// 更新轮播图
export function updateSwiper(params) {
  return request({
    url: '/api/v1/swiper/updateSwiper',
    method: 'post',
    data: params
  })
}
