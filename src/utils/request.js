import axios from 'axios'

// 创建一个axios实例
// 通过axios创建出来的实例跟axios一样
// 但是集成了一些配置项
const request = axios.create({
  baseURL: 'http://liufusong.top:8899/api/private/v1/'
})

// 导出
export default request
