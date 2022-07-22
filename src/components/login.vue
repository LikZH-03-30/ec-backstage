<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatat_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 头像区域 -->
      <!-- 登录表单区域    rules>> 表单验证属性form上的-->
      <!-- 要实现点击重置功能，要给form表单绑定ref属性，通过ref
       就能拿到表单的实例对象 然后能调用form表单里面的resetFleids，实现重置 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名账号 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入账号"
            v-model="loginForm.username"
            prefix-icon="iconfont icon-yonghu-copy"
          ></el-input>
        </el-form-item>
        <!-- 用户名账号 -->
        <!-- 用户名密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-suoding "
          ></el-input>
        </el-form-item>
        <!-- 用户名密码 -->
        <!-- button按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="restloginForm">重置</el-button>
        </el-form-item>
        <!-- button按钮 -->
      </el-form>
      <!-- 登录表单区域 -->
    </div>
  </div>
</template>

<script>
// import { getlogin } from '@/api'
export default {
  name: 'login',
  data() {
    return {
      // 这是表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则对象
      loginFormRules: {
        // 验证账号是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6~15位之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮
    restloginForm() {
      // console.log(this)
      // 通过ref给表单实例对象上绑定一个loginFormRef里面有
      this.$refs.loginFormRef.resetFields()
      // 让输入框的内容为空
      this.loginForm.username = ''
      this.loginForm.password = ''
    },
    // 点击登录
    login() {
      // validate也是通过ref实例对象.loginFormRef中拿到 在validate 中接收一个回调参数是一个布尔值,
      // 我们可以通过返回的是true还是false来判断表单颜值是否通过
      this.$refs.loginFormRef.validate(async (valid) => {
        //   // console.log(valid)
        //   // 判断valid是否为false,如果是false就不发起请求
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登陆成功')
        // 存到本地存储里面
        window.sessionStorage.setItem('token', res.data.token)
        // 通过编程式导航
        this.$router.push('/home')
        console.log(res)
      })
      // try {
      //   await this.$refs.loginForm.validate()
      //   this.loading = true
      //   await this.login(this.loginForm)
      //   this.$router.push({
      //     // path: this.redirect || '/'
      //   })
      //   this.loading = false
      // } catch (e) {
      //   this.loading = false
      // }
    }
  }
}
</script>

<style scoped lang="less">
// html, body {
//   height: 100%;
// }
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute; //定位在body里面
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); // 居中

  .avatat_box {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    padding: 10px;
    border: 1px solid #eee;
    box-shadow: 0 0 10px green;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}
// 让输入框底部对齐
.login_form {
  position: absolute;
  bottom: 20px;
  width: 100%;
  padding: 0 20px;
  // 因为默认form表单默认是 box-sizing: content-box;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
