import request from '@/utils/request'
// 表单校验 登录的接口
export const getlogin = (username, password) => {
  return request({
    method: 'POST',
    url: 'login',
    data: {
      username,
      password
    }
  })
}