<template>
  <!-- 分类参数 -->
  <div>
    <!-- >>>>>>>>>>>>>>>>>>面包屑导航 >>>>>>>>>>>>>>>>>>>>>>>-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_sort">
        <el-col>
          <span class="cat_sort">选择商品分类:</span>
          <!-- 选择商品分类的联级选择框 -->
          <!-- options 存放数据的  -->
          <el-cascader
            class="cascaders"
            expand-trigger="hover"
            v-model="selectedCateKeys"
            :options="CateLists"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab选择 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态属性" name="first">
          <el-button type="primary" size="mini" :disabled="isBtndisabled"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" size="mini">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'params',
  data() {
    return {
      // 获取所有分类的参数
      CateLists: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id', // 分类参数所属分类
        label: 'cat_name', // 分类参数名称
        children: 'children' // children实现父子嵌套
      },
      // 联级选择框双向绑定到的数组
      selectedCateKeys: [],
      // 默认选中第一个tab
      activeName: 'first'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有分类的参数
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类参数失败')
      }
      console.log(res)
      this.CateLists = res.data
    },
    // 联级选择框选中项变化时,会触发这个函数
    handleChange() {
      // console.log(this.selectedCateKeys)
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return null
      }
      // console.log(this.selectedCateKeys)
    },
    handleTabClick() {
      console.log(this.activeName)
    }
  },
  computed: {
    isBtndisabled() {
      // 这里判断一下 如果选中的不是三级联级 就把按钮设置为true禁用掉
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped lang="less">
.cat_sort {
  margin: 15px 10px 15px 0px;
}
.cascaders {
  width: 18%;
}
</style>
