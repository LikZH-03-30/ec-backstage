<template>
  <div>
    <!-- >>>>>>>>>>>>>>>>>>面包屑导航 >>>>>>>>>>>>>>>>>>>>>>>-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- <!>>>>>>>>>>>>>>>>>>>>>>>>>卡片区域 >>>>>>>>>>>>>>>>>>>>>>>>>>>> -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addSort">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <!-- selection-type 左边的全选框改成false就不会显示
      expand-type >> 是否为展开行   show-index >> 是否展示索引列-->
      <tree-table
        class="tables"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 列 -->
        <template slot="isok" slot-scope="scope">
          <i
            style="color: lightgreen"
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i style="color: red" class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="operation" slot-scope="scope">
          <!-- {{scope}} -->
          <!-- {scope} -->
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edits(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            @click="DeletEsort(scope.row.cat_id)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> -->
      <el-row type="flex" justify="center">
        <el-pagination
          class="paginations"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querInfo.pagenum"
          :page-sizes="[4, 5, 10, 15]"
          :page-size="querInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 点击添加分类弹框 -->
    <el-dialog
      @close="addCateDialogClosed"
      title="添加商品分类"
      :visible.sync="addGoodsSort"
      width="50%"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :rules="addCateFormRules"
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options 用来指定数据源 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 11111 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodsSort = false">取 消</el-button>
        <el-button type="primary" @click="addCates">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击编辑分类 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="EditVisibleDialogSort"
      width="50%"
    >
      <el-form
        :rules="editCateFormRules"
        ref="editCateFormRef"
        :model="editCateForm"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditVisibleDialogSort = false">取 消</el-button>
        <el-button type="primary" @click="editIsok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 编辑的表单
      editCateForm: {},
      // 编辑的校验规则
      editCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 获取商品分类的数据
      catelist: [],
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1, // 页码
        pagesize: 4 // 每个页面限制几条数据
      },
      // 总数据条数
      total: 0,
      // 为tabel指定列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'operation'
        }
      ],
      // 控制添加商品分类的显示与隐藏
      addGoodsSort: false,
      // 控制编辑弹框的显示与隐藏
      EditVisibleDialogSort: false,
      // 添加分类表单的数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级,默认是1级
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类的列表数据
      parentCateList: [],
      // 指定联级选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级的Id数组
      selectedKeys: []
    }
  },
  created() {
    this.getCreaList()
  },
  // 计算属性
  computed: {
    allPage() {
      return this.total % this.querInfo.pagesize === 0
    },
    // 拿到最大属性
    maxPage() {
      return Math.ceil(this.total / this.querInfo.pagesize)
    }
  },
  methods: {
    // 获取所有商品分类管理数据
    async getCreaList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败')
      }
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
      // console.log(this.catelist)
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      // 刷新数据列表
      this.getCreaList()
    },
    // 监听 pagenum改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      // 刷新数据列表
      this.getCreaList()
    },
    // 添加商品分类弹框
    addSort() {
      // 点击添加分类 的时候 获取分类的数据列表
      this.getParentCateList()
      // 打开弹框
      this.addGoodsSort = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      // 吧数据保存在data中
      this.parentCateList = res.data
      // console.log(res.data)
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前的分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击添加确认分类
    addCates() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        // 成功就发起请求 添加
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        // 点击确认下面的页码调到最后，就是能看见新加的数据
        this.allPage
          ? (this.querInfo.pagenum = this.maxPage + 1)
          : (this.querInfo.pagenum = this.maxPage)
        // if (this.catelist.length === 1) return this.querInfo.pagenum++
        this.$message.success('添加分类成功')
        // 渲染页面
        this.getCreaList()
        // 关闭弹层
        this.addGoodsSort = false
      })
    },
    // 监听分类表单弹框关闭事件 重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      // this.重置下id和父级分类
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      // 重置selectedKeys
      this.selectedKeys = []
    },
    // 编辑的业务弹框 根据 id 查询分类 这里有问题
    async edits(id) {
      const { data: res } = await this.$http.get('categories/', id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类信息失败')
      }
      this.editCateForm = res.data
      // console.log(this.editCateForm)
      this.EditVisibleDialogSort = true
    },
    // 点击确认编辑 这里有问题
    editIsok() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return
        console.log(valid)
        // 如果验证通过就发起请求
        const { data: res } = await this.$http.put(
          'categories/',
          this.editCateForm.cat_id,
          {
            cat_name: this.editCateForm.cat_name
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类失败')
        }
        this.$message.success('编辑分类成功')
        // 添加成功之后重新渲染页面
        this.getCreaList()
        this.EditVisibleDialogSort = false // 吧弹出层关闭
      })
    },
    // 删除分类
    async DeletEsort(id) {
      const confirmResultEsort = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((error) => error)
      // 如果用户确认删除则返回一个字符串 confirm
      // 如果用户取消删除则返回一个字符串 cancel
      if (confirmResultEsort !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // 如果点击了删了，这边就要发起一个删除单个分类的请求
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败')
      // const len = this.catelist.length
      if (this.catelist.length === 1) {
        this.querInfo.pagenum--
        // this.getCreaList()
      }
      this.$message.success('删除分类成功')
      // 渲染页面
      this.getCreaList()
    }
  }
}
</script>

<style scoped lang="less">
.tables {
  margin-top: 15px;
}
.paginations {
  margin-top: 30px;
}
</style>
