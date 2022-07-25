<template>
  <div id="app">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="../assets/heima.png" alt="" />
          <span>杭州黑马后台管理系统</span>
        </div>
        <el-button type="info" @click="loginout">退出</el-button>
      </el-header>
      <el-container>
        <!--侧边栏  -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="foldbtn">|||</div>
          <!-- 侧边栏导航 -->
          <el-menu
            :collapse-transition="false"
            unique-opened
            background-color="#373d41"
            text-color="#fff"
            active-text-color="#3899ff"
            :collapse="isCollapse"
            router
            :default-active="activePath"
          >
            <!-- 这里设置唯一的id,这样就不会点一个全下拉弹出来了
          因为循坏出来的id是数字，所以我们要给他转成字符串 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuList"
              :key="item.id"
            >
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- <i :class="iconObj[item.id]"></i> -->
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/' + subItem.path)"
              >
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'home',
  // 在vue生命周期加载的时候就调用它
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
      // subItem: []
    }
  },
  methods: {
    loginout() {
      // console.log(111)
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
    },
    // 点击折叠面板
    foldbtn() {
      this.isCollapse = !this.isCollapse
    },
    // 点击让二级路由高亮
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding-left: 0;
  background-color: #363d40;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #373d41;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  width: 100%;
  height: 40px;
  background-color: #ff69b4;
  text-align: center;
  line-height: 40px;
  user-select: none;
  // 每个|| 都有5px的间距
  letter-spacing: 5px;
  color: #fff;
  // 鼠标经过的时候有个小手
  cursor: pointer;
}
</style>
