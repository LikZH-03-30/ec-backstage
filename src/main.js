import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
// 导入icon图标
import './assets/fots/iconfont.css'
// 表格组件
import TreeTable from 'vue-table-with-tree-grid'
// import request from '@/utils/request'
import axios from 'axios'
// // 配置请求的根路径
axios.defaults.baseURL = 'http://liufusong.top:8899/api/private/v1/'
Vue.prototype.$http = axios
// 配置请求拦截器,什么时候要用到呢？ 判断用户登录没,访问其他功能的时候看有没有携带token
axios.interceptors.request.use((config) => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  // request,
  render: (h) => h(App)
}).$mount('#app')
