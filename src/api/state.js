import request from '@/utils/request'
// 修改用户状态
export const getUserState = () => {
  return request({
    method: 'put'
    // url: `users/${userinfo.id}/state/${userinfo.mg_state}`
  })
}