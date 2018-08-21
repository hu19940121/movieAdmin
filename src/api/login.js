import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: 'api/v1/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: 'api/v1/user/userinfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'api/v1/user/logout',
    method: 'post'
  })
}
