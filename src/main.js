import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
// 导入icon图标
import './assets/fots/iconfont.css'

// import request from '@/utils/request'
import axios from 'axios'
// // 配置请求的根路径
axios.defaults.baseURL = 'http://liufusong.top:8899/api/private/v1/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  // request,
  render: (h) => h(App)
}).$mount('#app')
