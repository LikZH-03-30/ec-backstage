import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 导入弹框提示
// 吧弹框组件挂载在全局上，这样没一个组件都能用this访问到message
Vue.prototype.$message = Message
