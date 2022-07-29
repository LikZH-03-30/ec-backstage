import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import Login from '@/components/login.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('@/components/login')
    },
    {
      path: '/home',
      redirect: '/welcome',
      component: () => import('@/components/Home'),
      children: [
        {
          path: '/welcome',
          component: () => import('@/components/Welcome')
        },
        {
          path: '/users',
          component: () => import('@/components/user/Users.vue')
        },
        {
          path: '/rights',
          component: () => import('@/components/power/Rights')
        },
        {
          path: '/roles',
          component: () => import('@/components/power/Roles')
        },
        {
          path: '/categories',
          component: () => import('@/components/goods/cate.vue')
        }
      ]
    }
  ]
})

// 挂载全局路由守卫 beforeEach
router.beforeEach((to, from, next) => {
  // to 将要访问的路径  from代表从哪个路径跳转而来 next是一个函数,表示放行
  // next()放行 next(/login) 强制跳转
  // 首先判断下用户是否访问的登录页面  如果是登录页面那么就放行 next
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 判断有没有token 如果没有token就强制跳转到登录页面
  if (!tokenStr) return next('/login')
  // 反之
  next()
})

export default router
